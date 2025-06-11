import { aminoToGroup, type AminoAcid } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Props = {
    amino: AminoAcid;
    forced?: string;
} & ComponentProps<"div">;

const AminoColor = ({ amino, forced, className, ...props }: Props) => {
    const group = aminoToGroup[amino.toUpperCase() as AminoAcid];

    return (
        <div
            className={cn(
                `bg-${group} p-2 rounded-md text-lg size-11 inline-flex justify-center items-center`,
                {
                    [`bg-${forced}`]: forced,
                },
                className
            )}
            {...props}
        >
            {amino}
        </div>
    );
};

export default AminoColor;
