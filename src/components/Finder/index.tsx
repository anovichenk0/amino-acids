import React, {
    createContext,
    useCallback,
    useContext,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";
import { CommandDialog, CommandInput } from "@/components/command";
import { cn } from "@/lib/utils";

const FinderContext = createContext({
    register: (
        text: string | null,
        setEnableCallback: React.Dispatch<React.SetStateAction<boolean>>
    ) => {},
    search: "",
    setSearch: (s: string) => {},
});

export const FinderProvider = ({ children }: { children: ReactNode }) => {
    const [search, setSearch] = useState("fsdfsd");
    const collection = useRef<
        {
            text: string;
            setEnableCallback: React.Dispatch<React.SetStateAction<boolean>>;
        }[]
    >([]);
    const deferredSearch = useDeferredValue(search);

    useEffect(() => {
        const items = collection.current;
        if (!deferredSearch || !items.length) {
            items.forEach((item) => item.setEnableCallback(false));
            return;
        }

        const fullText = items.map((item) => item.text).join("");
        const searchLower = deferredSearch.toLowerCase();
        const fullTextLower = fullText.toLowerCase();

        const matchIndices: number[] = [];
        let currentIndex = 0;

        while (currentIndex < fullTextLower.length) {
            const startIndex = fullTextLower.indexOf(searchLower, currentIndex);
            if (startIndex === -1) break;

            matchIndices.push(startIndex);
            currentIndex = startIndex + 1;
        }

        items.forEach((item, index) => {
            const isMatched = matchIndices.some(
                (startIndex) =>
                    index >= startIndex &&
                    index < startIndex + deferredSearch.length
            );
            item.setEnableCallback(isMatched);
        });
    }, [deferredSearch]);

    const register = useCallback(
        (
            text: string | null,
            setEnableCallback: React.Dispatch<React.SetStateAction<boolean>>
        ) => {
            if (text !== null) {
                collection.current.push({ text, setEnableCallback });
            }
        },
        []
    );

    const value = useMemo(
        () => ({
            register,
            search,
            setSearch,
        }),
        [register, search, setSearch]
    );

    return (
        <FinderContext.Provider value={value}>
            {children}
        </FinderContext.Provider>
    );
};

export const Finder = () => {
    const [open, setOpen] = useState(false);
    const { search, setSearch } = useFinderContext();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === "q") && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }

            if (open && e.key === "Enter") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <p className="text-muted-foreground text-sm">
                Press{" "}
                <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>F or
                    <span className="text-xs">⌘</span>Q
                </kbd>
            </p>
            <CommandDialog
                showCloseButton={false}
                open={open}
                onOpenChange={setOpen}
            >
                <CommandInput
                    value={search}
                    onValueChange={(value) => {
                        setSearch(value);
                    }}
                    placeholder="Поиск по аминокислотам"
                />
            </CommandDialog>
        </>
    );
};

export const useFinderContext = () => {
    const context = useContext(FinderContext);

    if (context === undefined) {
        throw new Error("FinderContext not found");
    }

    return context;
};

export const Finding = ({
    children,
    enabledClassName,
    className,
    ...props
}: ComponentProps<"div"> & { enabledClassName: string }) => {
    const [enabled, setEnabled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { register } = useFinderContext();

    useEffect(() => {
        const node = ref.current;
        if (node) {
            register(node.textContent, setEnabled);
        }
    }, [register]);

    return (
        <div
            className={cn(className, {
                [enabledClassName]: enabled,
            })}
            ref={ref}
            {...props}
        >
            {children}
        </div>
    );
};
export default Finding;
