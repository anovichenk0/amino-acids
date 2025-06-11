import { cn } from "@/lib/utils";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";

import { insertText } from "@/lib/insertText";
import { useDebounce } from "@/lib/useDebounce";
import { toast } from "sonner";

const SelectedContext = createContext({
    selected: "",
    setSelected: (() => undefined) as React.Dispatch<
        React.SetStateAction<string>
    >,
    addText: (selected: string, order?: number) => {},
});

export const SelectedProvider = ({ children }: { children: ReactNode }) => {
    const [selected, setSelected] = useState("");
    const [copiedText, setCopiedText] = useDebounce(selected, 1000);

    useEffect(() => {
        async function effect() {
            if (copiedText) {
                try {
                    await navigator.clipboard.writeText(copiedText);
                    toast.success(`Скопировано!\n ${copiedText}`);
                } catch (e) {
                    console.error(e);
                    toast.error(
                        "Ошибка при копировании - подробности в консоли"
                    );
                } finally {
                    setSelected("");
                    setCopiedText("");
                }
            }
        }
        effect();
    }, [copiedText, setCopiedText]);

    const addText = useCallback(
        (selected: string, order?: number) => {
            if (order === undefined) {
                setSelected((s) => {
                    return s + selected;
                });
            } else {
                setSelected((s) => {
                    return insertText(s, selected, order);
                });
            }
        },
        [setSelected]
    );

    const value = useMemo(
        () => ({
            selected,
            setSelected,
            addText,
        }),
        [selected, setSelected, addText]
    );

    return (
        <SelectedContext.Provider value={value}>
            {children}
        </SelectedContext.Provider>
    );
};

export const useSelectedContext = () => {
    const context = useContext(SelectedContext);

    if (context === undefined) {
        throw new Error("SelectedContext not found");
    }

    return context;
};

const Selectable = ({
    children,
    className,
    selectedClassName,
    order,
    ...props
}: ComponentProps<"div"> & { selectedClassName?: string; order?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isSelected, setIsSelected] = useState<boolean>();
    const { addText, selected } = useSelectedContext();

    if (selected === "" && isSelected) {
        setIsSelected(false);
    }

    useEffect(() => {
        const node = ref.current;

        function mouseOnListener() {
            if (isSelected) return;
            addText(node?.textContent ?? "", order);
            setIsSelected(true);
        }

        if (node) {
            node.addEventListener("mouseenter", mouseOnListener);
        }

        return () => {
            node?.removeEventListener("mouseenter", mouseOnListener);
        };
    }, [addText, isSelected, order]);

    return (
        <div
            ref={ref}
            className={cn(className, {
                [selectedClassName]: isSelected,
            })}
            {...props}
        >
            {children}
        </div>
    );
};

export default Selectable;
