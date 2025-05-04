import { useEffect, useRef } from 'react';

export function useClientOnce(setup: () => void | undefined | (() => void)) {
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