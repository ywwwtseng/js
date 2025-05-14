import {
  useState,
  useMemo,
  useCallback,
  type ReactNode
} from 'react';
import { init, postEvent } from '@telegram-apps/sdk-react';
import { useClientOnce } from '@libs/hooks';
import { Client } from '@libs/client';
import * as object from '@libs/object';
import type { Action } from '@libs/api';
import { TonConnect, MockTonConnectUI, TonConnectUI } from './TonConnect';
import { useTelegramSDK } from './hooks/useTelegramSDK';
import { useForceUpdate } from './hooks/useForceUpdate';
import { TMAContext, TMAContextState } from './TMAContext';

export type Locale = Record<string, Record<string, string>>;

export type Locales = Record<string, Locale>;

export interface TMAProviderProps {
  mock?: boolean;
  mockTelegramId?: string | number | undefined;
  background?: `#${string}`;
  locales?: Locales; 
  baseUrl: string;
  children: ReactNode;
}

export function TMAProvider<TState>({
  mock = false,
  mockTelegramId,
  background = '#000000',
  locales,
  baseUrl,
  children
}: TMAProviderProps) {
  const [avatar, setAvatar] = useState<HTMLImageElement | null>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [state, setState] = useState<TMAContextState<TState>['state']>(undefined);
  const [loading, setLoading] = useState([]);
  const forceUpdate = useForceUpdate();
  const { launchParams, initDataRaw } = useTelegramSDK(mock, mockTelegramId);
  const user = launchParams?.tgWebAppData?.user;
  const platform = launchParams?.tgWebAppPlatform;

  const languageCode =
    (state as any)?.meta?.language_code
    || (state as any)?.language_code
    || user.language_code;

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

  const launch = useCallback(async () => {
    setAuthorized(false);
    
    client
      .post<{ data: any }>(
        '/api/launch',
        {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        // { credentials: 'include' }
      )
      .then((res) => {
        setState(res?.data);
        setAuthorized(true);
      })
      .catch((err) => {
        console.error(err);
        setAuthorized(false);
      });
  }, [client]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    if (!locales) return key;
    const locale = locales?.[languageCode?.toLowerCase()?.slice(0, 2)] || locales?.['en'];
    if (!locale || typeof key !== 'string') return key;
    const template = object.get(locale, key, key);
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_: string, key: string) => String(params[key]) || '');
  }, [languageCode]);

  const mutate = useCallback((mutation: string | Action<TState, any>, payload?: any) => {
    const mutationType = typeof mutation === 'string' ? mutation : mutation.type;

    if (loading.includes(mutationType)) {
      return Promise.reject(`${mutationType} update mutation is processing...`);
    }

    const endpoint = typeof mutation === 'string' ? '/api/update' : '/api/action';
    const body = typeof mutation === 'string'
      ? {
        path: mutation.split('.'),
        value: payload,
      }
      : {
        type: mutation.type,
        payload,
      };

      setLoading((prev) => ([...prev, mutationType]));

    return client.post(endpoint, body).then((res: any) => {
      setState((state: any) => object.merge({}, state, res.data || {}));
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading((prev) => prev.filter((m) => m !== mutationType));
    });
  }, [loading]);

  const isLoading = useCallback((mutation: string | Action<TState, any>) => {
    return loading.includes(typeof mutation === 'string' ? mutation : mutation.type);
  }, [loading]);

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
    launch();
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
    mutate,
    isLoading,
    t,
  }), [user, platform, tonConnect, initDataRaw, avatar, authorized, state, client, t]);

  return (
    <TMAContext value={value}>
      {children}
    </TMAContext>
  );
}
