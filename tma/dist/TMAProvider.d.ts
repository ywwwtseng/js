import { type ReactNode } from 'react';
export interface TMAProviderProps {
    mock?: boolean;
    background?: `#${string}`;
    baseUrl: string;
    children: ReactNode;
}
export declare function TMAProvider({ mock, background, baseUrl, children }: TMAProviderProps): import("react/jsx-runtime").JSX.Element;
