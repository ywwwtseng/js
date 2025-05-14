export declare function useTelegramSDK(mock: boolean, mockTelegramId: string | number | undefined): {
    launchParams: {
        tgWebAppBotInline?: boolean;
        tgWebAppData?: {
            auth_date: Date;
            can_send_after?: number;
            chat?: {
                id: number;
                photo_url?: string;
                type: string;
                title: string;
                username?: string;
            } & {
                [key: string]: unknown;
            };
            chat_type?: string;
            chat_instance?: string;
            hash: string;
            query_id?: string;
            receiver?: {
                added_to_attachment_menu?: boolean;
                allows_write_to_pm?: boolean;
                first_name: string;
                id: number;
                is_bot?: boolean;
                is_premium?: boolean;
                last_name?: string;
                language_code?: string;
                photo_url?: string;
                username?: string;
            } & {
                [key: string]: unknown;
            };
            start_param?: string;
            signature: string;
            user?: {
                added_to_attachment_menu?: boolean;
                allows_write_to_pm?: boolean;
                first_name: string;
                id: number;
                is_bot?: boolean;
                is_premium?: boolean;
                last_name?: string;
                language_code?: string;
                photo_url?: string;
                username?: string;
            } & {
                [key: string]: unknown;
            };
        } & {
            [key: string]: unknown;
        };
        tgWebAppDefaultColors?: {
            accent_text_color?: `#${string}`;
            bg_color?: `#${string}`;
            button_color?: `#${string}`;
            button_text_color?: `#${string}`;
            bottom_bar_bg_color?: `#${string}`;
            destructive_text_color?: `#${string}`;
            header_bg_color?: `#${string}`;
            hint_color?: `#${string}`;
            link_color?: `#${string}`;
            secondary_bg_color?: `#${string}`;
            section_bg_color?: `#${string}`;
            section_header_text_color?: `#${string}`;
            section_separator_color?: `#${string}`;
            subtitle_text_color?: `#${string}`;
            text_color?: `#${string}`;
        };
        tgWebAppFullscreen?: boolean;
        tgWebAppPlatform: string;
        tgWebAppShowSettings?: boolean;
        tgWebAppStartParam?: string;
        tgWebAppThemeParams: {
            accent_text_color?: `#${string}`;
            bg_color?: `#${string}`;
            button_color?: `#${string}`;
            button_text_color?: `#${string}`;
            bottom_bar_bg_color?: `#${string}`;
            destructive_text_color?: `#${string}`;
            header_bg_color?: `#${string}`;
            hint_color?: `#${string}`;
            link_color?: `#${string}`;
            secondary_bg_color?: `#${string}`;
            section_bg_color?: `#${string}`;
            section_header_text_color?: `#${string}`;
            section_separator_color?: `#${string}`;
            subtitle_text_color?: `#${string}`;
            text_color?: `#${string}`;
        };
        tgWebAppVersion: string;
    } & {
        [key: string]: unknown;
    };
    initDataRaw: string;
};
