# Infra

### Install
```sh
bun add github:ywwwtseng/libs @pulumi/aws @pulumi/pulumi fs mime path
```

### Setup

Pulumi.yaml
```yaml
name: demo-infra
runtime: nodejs
description: Demo deployed to AWS Asia (Singapore).
```

```sh
pulumi login
pulumi stack select
pulumi stack select [stack]
pulumi config set aws:region ap-southeast-1
pulumi config set --secret aws:accessKey accessKey
pulumi config set --secret aws:secretKey secretKey
pulumi config set --secret infra:postgresUsername postgresUsername
pulumi config set --secret infra:postgresPassword postgresPassword
pulumi config set --secret infra:sshKey "$(cat ~/.ssh/id_rsa.pub)"
pulumi config set infra:postgresInstanceClass db.t3.micro
pulumi config set infra:ec2InstanceType t3.micro
pulumi config set infra:webContentsRoot ../web/dist
pulumi config set infra:acmCertificateArn arn:aws:acm:us-east-1:xxxxxxxx:certificate/xxxx-xxxxx-xxxx-xxx-xxx--xxxx
pulumi config set infra:domainName xxxxxxxx.com
pulumi up
pulumi destroy
```

### Example
```js
export * from '@libs/infra';
```