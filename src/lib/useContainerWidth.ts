import { useEffect, useRef, useState } from "react";

export const useContainerWidth = <T extends HTMLElement>() => {
    const [width, setWidth] = useState<number>(0);
    const containerRef = useRef<T>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const newWidth = containerRef.current.offsetWidth;
                setWidth(newWidth);
            }
        };

        updateWidth();

        const resizeObserver = new ResizeObserver(updateWidth);

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return { width, containerRef };
};
