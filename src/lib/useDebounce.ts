import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): [T, (v: T) => void] {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(() => value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return [debouncedValue, setDebouncedValue];
}
