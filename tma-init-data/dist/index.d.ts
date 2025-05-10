export declare enum StartParamType {
    NONE = "n",
    REFERRAL = "r",
    PARTNER = "p"
}
export declare const parseStartParam: (startParam: string | null) => {
    type: string;
    value: string;
};
export declare const validate: (headers: Record<string, string | undefined>) => Promise<{
    telegram_id: string;
    username: string;
    first_name: string;
    last_name: string;
    photo_url: string;
    language_code: string;
    start_param: {
        type: string;
        value: string;
    };
}>;
