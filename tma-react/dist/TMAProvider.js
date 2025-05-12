import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from 'react';
import { init, postEvent } from '@telegram-apps/sdk-react';
import { useClientOnce } from '@libs/hooks';
import { Client } from '@libs/client';
import * as object from '@libs/object';
import { TonConnect, MockTonConnectUI, TonConnectUI } from './TonConnect';
import { useTelegramSDK } from './hooks/useTelegramSDK';
import { useForceUpdate } from './hooks/useForceUpdate';
import { TMAContext } from './TMAContext';
export function TMAProvider({ mock = false, background = '#000000', locales, baseUrl, children }) {
    const [avatar, setAvatar] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const [state, setState] = useState(undefined);
    const forceUpdate = useForceUpdate();
    const { launchParams, initDataRaw } = useTelegramSDK(mock);
    const user = launchParams?.tgWebAppData?.user;
    const platform = launchParams?.tgWebAppPlatform;
    const languageCode = state?.meta?.language_code
        || state?.language_code
        || user.language_code;
    const tonConnect = useMemo(() => new TonConnect({
        TonConnectUI: mock
            ? MockTonConnectUI
            : TonConnectUI,
        onStatusChange: () => {
            forceUpdate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);
    const client = useMemo(() => {
        const headers = {};
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
            .post('/launch', {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
            .then((res) => {
            setState(res?.data);
            setAuthorized(true);
        })
            .catch((err) => {
            console.error(err);
            setAuthorized(false);
        });
    }, [client]);
    const t = useCallback((key, params) => {
        if (!locales)
            return key;
        const locale = locales?.[languageCode?.toLowerCase()?.slice(0, 2)] || locales?.['en'];
        if (!locale || typeof key !== 'string')
            return key;
        const template = object.get(locale, key, key);
        if (!params)
            return template;
        return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key]) || '');
    }, [languageCode]);
    const mutate = useCallback((mutation, payload) => {
        if (typeof mutation === 'string') {
            return client.post('/update', {
                path: mutation.split('.'),
                value: payload,
            }).then((res) => {
                setState((state) => object.merge({}, state, res.data || {}));
            });
        }
        else if (object.is(mutation)) {
            return client.post('/action', {
                type: mutation.type,
                payload,
            }).then((res) => {
                setState((state) => object.merge({}, state, res.data || {}));
            });
        }
        else {
            throw new Error('Invalid mutation');
        }
    }, []);
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
        t,
    }), [user, platform, tonConnect, initDataRaw, avatar, authorized, state, client, t]);
    return (_jsx(TMAContext, { value: value, children: children }));
}
