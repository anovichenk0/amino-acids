import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const Context = createContext({
    aminoFirst: "",
    aminoSecond: "",
    setAminos: (() => undefined) as React.Dispatch<
        React.SetStateAction<{
            aminoFirst: string;
            aminoSecond: string;
        }>
    >,
});

const Provider = ({ children }: { children: ReactNode }) => {
    const [aminos, setAminos] = useState({
        aminoFirst: "",
        aminoSecond: "",
    });

    const value = useMemo(
        () => ({
            ...aminos,
            setAminos,
        }),
        [aminos, setAminos]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAminoContext = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error("AminoContext not found");
    }

    return context;
};

export default Provider;
