import { use } from 'react';
import { TMAContext } from './TMAContext';
export function useTMA() {
    const context = use(TMAContext);
    if (!context) {
        throw new Error("useTMA must be used within a TMAProvider");
    }
    return context;
}
