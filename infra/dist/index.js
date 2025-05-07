import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as fs from 'fs';
import * as path from 'path';
import mime from 'mime';

const region = new pulumi.Config('aws').require('region');
const config = new pulumi.Config('infra');
const project = pulumi.getProject();
const stack = pulumi.getStack();
const name = `${project}-${stack}`;

class Vpc {
  constructor() {
    const availabilityZones = [`${region}a`, `${region}c`];
    const vpc = new aws.ec2.Vpc(`${name}-vpc`, {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      tags: {
        name: `${name}-vpc`
      }
    });

    const publicSubnet1 = new aws.ec2.Subnet(`${name}-subnet-pub-1`, {
      vpcId: vpc.id,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: availabilityZones[0],
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `${name}-subnet-pub-1`,
      },
    });

    const publicSubnet2 = new aws.ec2.Subnet(`${name}-subnet-pub-2`, {
      vpcId: vpc.id,
      cidrBlock: '10.0.2.0/24',
      availabilityZone: availabilityZones[1],
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `${name}-subnet-pub-2`,
      },
    });

    const privateSubnet1 = new aws.ec2.Subnet(`${name}-subnet-pvt-1`, {
      vpcId: vpc.id,
      cidrBlock: '10.0.3.0/24',
      availabilityZone: availabilityZones[0],
      mapPublicIpOnLaunch: false,
      tags: {
        Name: `${name}-subnet-pvt-1`,
      },
    });

    const privateSubnet2 = new aws.ec2.Subnet(`${name}-subnet-pvt-2`, {
      vpcId: vpc.id,
      cidrBlock: '10.0.4.0/24',
      availabilityZone: availabilityZones[1],
      mapPublicIpOnLaunch: false,
      tags: {
        Name: `${name}-subnet-pvt-2`,
      },
    });

    const igw = new aws.ec2.InternetGateway(`${name}-igw`, {
      vpcId: vpc.id,
    });

    const routeTable = new aws.ec2.RouteTable(`${name}-route-table`, {
      vpcId: vpc.id,
      routes: [{
        cidrBlock: '0.0.0.0/0',
        gatewayId: igw.id,
      }],
    });

    this.id = vpc.id;
    this.publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];
    this.privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];
    this.routeTable = routeTable; 
  }
}

class Ec2 {
  constructor({ vpc, ...args }) {
    const sshKey = config.requireSecret('sshKey');

    new aws.ec2.RouteTableAssociation(`${name}-rta`, {
      subnetId: vpc.publicSubnetIds[0],
      routeTableId: vpc.routeTable.id,
    });

    const ec2SecurityGroup = new aws.ec2.SecurityGroup(`${name}-ec2-sg`, {
      vpcId: vpc.id,
      ingress: [
        { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] },
        { protocol: 'tcp', fromPort: 443, toPort: 443, cidrBlocks: ['0.0.0.0/0'] },
      ],
      egress: [{ protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }],
    });
    
    const ec2 = new aws.ec2.Instance(`${name}-ec2`, {
      ami: 'ami-065a492fef70f84b1',
      instanceType: config.require('ec2InstanceType') || 't3.micro',
      vpcSecurityGroupIds: [ec2SecurityGroup.id],
      subnetId: vpc.publicSubnetIds[0],
      tags: {
        Name: `${name}-ec2`
      },
      ...(sshKey
        ? {
          keyName: new aws.ec2.KeyPair(`${name}-keypair`, {
            publicKey: sshKey,
          }).keyName,
        } : {}
      ),
      ...args
    });

    this.publicIp = ec2.publicIp;
  }
}

class Postgres {
  constructor({ vpc, ...args }) {
    const username = config.requireSecret('postgresUsername');
    const password = config.requireSecret('postgresPassword');
    const rdsSubnetGroup = new aws.rds.SubnetGroup(`${name}-rds-subnet-group`, {
      subnetIds: vpc.privateSubnetIds,
      tags: {
        Name: `${name}-rds-subnet-group`,
      },
    });
    
    const rdsSecurityGroup = new aws.ec2.SecurityGroup(`${name}-rds-sg`, {
      vpcId: vpc.id,
      ingress: [
        {
          protocol: 'tcp',
          fromPort: 5432,
          toPort: 5432,
          cidrBlocks: ['10.0.0.0/16'], // 限定 VPC 內部訪問
        },
      ],
      egress: [
        {
          protocol: '-1',
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
    });
    
    const postgres = new aws.rds.Instance(`${name}-postgres-db`, {
      engine: 'postgres',
      engineVersion: '16.3',
      instanceClass: config.require('postgresInstanceClass') || 'db.t3.micro',
      allocatedStorage: 20,
      dbName: `${name}-postgres-db`.replace(/[^a-zA-Z0-9]/g, ''),
      dbSubnetGroupName: rdsSubnetGroup.name,
      vpcSecurityGroupIds: [rdsSecurityGroup.id],
      // backupRetentionPeriod: 5,                  // 備份保留天數 (1-35)
      // backupWindow: '19:00-20:00',               // 備份時間窗口 Asia/Taipei 03:00-04:00
      // maintenanceWindow: 'Mon:20:00-Mon:21:00',  // 維護時間窗口 Asia/Taipei 04:00-05:00
      skipFinalSnapshot: true,
      publiclyAccessible: false, // 關鍵：私網
      tags: {
        name: `${name}-postgres-db`
      },
      username,
      password,
      ...args,
    });

    this.url = pulumi.interpolate`postgres://${username}:${password}@${postgres.endpoint}/${postgres.dbName}?sslmode=require`;
  }
}

class WebSite {
  constructor({ webContentsRoot, acmCertificateArn, domainName }) {
    if (
      !webContentsRoot
      || !acmCertificateArn
      || !domainName
    ) {
      this.domainName = null;
    }

    const bucket = new aws.s3.Bucket(`${name}-site-bucket`, {
      website: {
        indexDocument: 'index.html',
        errorDocument: 'index.html',
      },
    });
    
    new aws.s3.BucketPublicAccessBlock(`${name}-public-access-block`, {
      bucket: bucket.id,
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    });
    
    function crawlDir(dir) {
      const files = fs.readdirSync(dir);
      let result = [];
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          result = result.concat(crawlDir(filePath));
        } else {
          result.push(filePath);
        }
      }
      return result;
    }
    
    const files = crawlDir(webContentsRoot);
    
    for (const filePath of files) {
      const relativePath = filePath.replace(`${webContentsRoot}/`, '');
    
      new aws.s3.BucketObject(relativePath, {
        bucket,
        source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
        contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
      });
    }
    
    // Create an S3 Bucket Policy to allow public read of all objects in bucket
    // This reusable function can be pulled out into its own module
    // function publicReadPolicyForBucket(bucketName) {
    //   return JSON.stringify({
    //     Version: '2012-10-17',
    //     Statement: [{
    //       Effect: 'Allow',
    //       Principal: '*',
    //       Action: [
    //         's3:GetObject'
    //       ],
    //       Resource: [
    //         `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
    //       ]
    //     }]
    //   })
    // }
    
    // Set the access policy for the bucket so all objects are readable
    // new aws.s3.BucketPolicy(`${name}-access-readable-bucket-policy`, {
    //   bucket: bucket.bucket, // depends on siteBucket -- see explanation below
    //   policy: bucket.bucket.apply(publicReadPolicyForBucket)
    //           // transform the siteBucket.bucket output property -- see explanation below
    // });
    
    const oai = new aws.cloudfront.OriginAccessIdentity(`${name}-oai`);
    
    new aws.s3.BucketPolicy(`${name}-bucket-policy`, {
      bucket: bucket.bucket,
      policy: pulumi.all([bucket.arn, oai.iamArn]).apply(([bucketArn, oaiArn]) => JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            AWS: oaiArn
          },
          Action: 's3:GetObject',
          Resource: `${bucketArn}/*`
        }],
      })),
    });
    
    const cdn = new aws.cloudfront.Distribution(`${name}-web-cdn`, {
      enabled: true,
      origins: [{
        domainName: bucket.bucketRegionalDomainName,
        originId: bucket.arn,
        s3OriginConfig: {
          originAccessIdentity: oai.cloudfrontAccessIdentityPath,
        },
      }],
      defaultRootObject: 'index.html',
      defaultCacheBehavior: {
        targetOriginId: bucket.arn,
        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: ['GET', 'HEAD'],
        cachedMethods: ['GET', 'HEAD'],
        forwardedValues: {
          queryString: false,
          cookies: { forward: 'none' },
        },
        compress: true,
        minTtl: 0,
        defaultTtl: 0,
        maxTtl: 0,
      },
      orderedCacheBehaviors: [
        {
          pathPattern: "/assets/*",
          targetOriginId: bucket.arn,
          viewerProtocolPolicy: "redirect-to-https",
          allowedMethods: ["GET", "HEAD"],
          cachedMethods: ["GET", "HEAD"],
          forwardedValues: {
            queryString: false,
            cookies: { forward: "none" },
          },
          compress: true,
          minTtl: 3600,
          defaultTtl: 86400,
          maxTtl: 86400,
          // maxTtl: 31536000,
        },
      ],
      priceClass: 'PriceClass_100',
      viewerCertificate: {
        cloudfrontDefaultCertificate: false,
        acmCertificateArn,
        sslSupportMethod: 'sni-only',
        minimumProtocolVersion: 'TLSv1.2_2021',
      },
      aliases: [domainName],
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      customErrorResponses: [
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    this.domainName = domainName;
  }
}

const vpc = new Vpc();
const ec2 = new Ec2({ vpc });
const postgres = new Postgres({ vpc });
const website = new WebSite({
  webContentsRoot: config.require('webContentsRoot'),
  acmCertificateArn: config.require('acmCertificateArn'),
  domainName: config.require('domainName'),
});

export const postgresUrl = postgres.url;
export const ec2PublicIp = ec2.publicIp;
export const domainName = website.domainName;
