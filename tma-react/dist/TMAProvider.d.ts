import { type ReactNode } from 'react';
export type Locale = Record<string, Record<string, string>>;
export type Locales = Record<string, Locale>;
export interface TMAProviderProps {
    mock?: boolean;
    background?: `#${string}`;
    locales?: Locales;
    baseUrl: string;
    children: ReactNode;
}
export declare function TMAProvider<TState>({ mock, background, locales, baseUrl, children }: TMAProviderProps): import("react/jsx-runtime").JSX.Element;
