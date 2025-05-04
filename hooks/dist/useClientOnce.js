import { useEffect, useRef } from 'react';
export function useClientOnce(setup) {
    const canCall = useRef(true);
    useEffect(() => {
        if (!canCall.current) {
            return;
        }
        canCall.current = false;
        const destroy = setup();
        return () => {
            if (destroy) {
                destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
