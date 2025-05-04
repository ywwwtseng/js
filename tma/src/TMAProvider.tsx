import {
  useState,
  useMemo,
  useCallback,
  type ReactNode
} from 'react';
import { init, postEvent } from '@telegram-apps/sdk-react';
import { useClientOnce } from '@libs/hooks';
import { Client } from '@libs/client';
import { TonConnect, MockTonConnectUI, TonConnectUI } from './TonConnect';
import { useTelegramSDK } from './hooks/useTelegramSDK';
import { useForceUpdate } from './hooks/useForceUpdate';
import { TMAContext } from './TMAContext';

export interface TMAProviderProps {
  mock?: boolean;
  background?: `#${string}`;
  baseUrl: string;
  children: ReactNode;
}

export function TMAProvider({
  mock = false,
  background = '#000000',
  baseUrl,
  children
}: TMAProviderProps) {
  const [avatar, setAvatar] = useState<HTMLImageElement | null>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [state, setState] = useState<unknown>(undefined);
  const forceUpdate = useForceUpdate();
  const { launchParams, initDataRaw } = useTelegramSDK(mock);
  const user = launchParams?.tgWebAppData?.user;
  const platform = launchParams?.tgWebAppPlatform;

  const tonConnect = useMemo<TonConnect>(() => new TonConnect({
    TonConnectUI: mock
      ? MockTonConnectUI
      : TonConnectUI,
    onStatusChange: () => {
      forceUpdate();
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const client = useMemo(() => {
    const headers: Record<string, string> = {};

    if (initDataRaw) {
      headers['Authorization'] = `tma ${initDataRaw}`;
    }

    return new Client({
      baseUrl,
      headers,
    });
  }, [initDataRaw]);

  const auth = useCallback(async () => {
    setAuthorized(false);
    
    client
      .post<{ data: unknown }>('/auth')
      .then((res) => {
        setState(res?.data);
        setAuthorized(true);
      })
      .catch((err) => {
        console.error(err);
        setAuthorized(false);
      });
  }, [client]);

  useClientOnce(() => {
    if (!mock && launchParams) {
      init();
      postEvent('web_app_set_header_color', { color: background });
      postEvent('web_app_set_bottom_bar_color', { color: background });
      postEvent('web_app_set_background_color', { color: background });
    }
  });

  useClientOnce(() => {
    if (user?.photo_url) {
      const image = new Image();
      
      image.onload = () => {
        setAvatar(image);
      };
      image.src = user.photo_url;
    }
  });

  useClientOnce(() => {
    auth();
  });
  
  const value = useMemo(() => ({
    user,
    platform,
    tonConnect,
    initDataRaw,
    avatar,
    authorized,
    state,
    request: {
      get: client.get.bind(client),
      post: client.post.bind(client),
      put: client.put.bind(client),
      delete: client.delete.bind(client),
    },
  }), [user, platform, tonConnect, initDataRaw, avatar, authorized, client]);

  return (
    <TMAContext value={value}>
      {children}
    </TMAContext>
  );
}
