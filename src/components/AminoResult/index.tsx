import React, { useMemo, type ReactNode } from "react";
import { useAminoContext } from "../AminoContext";
import AminoColor from "../AminoColor";
import type { AminoAcid } from "@/lib/types";
import { needlemanWunsch } from "@/lib/needlemanWunsch";
import { useContainerWidth } from "@/lib/useContainerWidth";
import { cn } from "@/lib/utils";
import Selectable, { SelectedProvider } from "../Selected";
import Finding from "../Finder";

const AminoResult = () => {
    const { aminoFirst, aminoSecond } = useAminoContext();
    const { width, containerRef } = useContainerWidth<HTMLDivElement>();

    const result = useMemo(
        () => needlemanWunsch(aminoFirst, aminoSecond),
        [aminoFirst, aminoSecond]
    );

    const alignedFirst = result.alignedSeq1.split("");
    const alignedSecond = result.alignedSeq2.split("");

    return (
        <div ref={containerRef} className="grid gap-2 ">
            <SelectedProvider>
                <RenderPerRow
                    render={(amino, i) => (
                        <Finding
                            className="rounded-md"
                            enabledClassName="border-fuchsia-400 border-2 border-solid"
                        >
                            <Selectable
                                className="rounded-md"
                                selectedClassName="border-dotted border-2 border-black"
                                order={i}
                            >
                                <AminoColor
                                    key={"first" + amino + i}
                                    amino={amino as AminoAcid}
                                />
                            </Selectable>
                        </Finding>
                    )}
                    aligned={alignedFirst}
                    containerWidth={width}
                    position={1}
                    rowClassName="bg-zinc-300 rounded-md"
                />
            </SelectedProvider>

            <SelectedProvider>
                <RenderPerRow
                    render={(amino, i) => {
                        const className =
                            alignedFirst.at(i) === amino
                                ? "bg-transparent"
                                : "";
                        return (
                            <Finding
                                className="rounded-md"
                                enabledClassName="border-fuchsia-400 border-2 border-solid"
                            >
                                <Selectable
                                    className="rounded-md"
                                    selectedClassName="border-dotted border-2 border-zinc "
                                    order={i}
                                >
                                    <AminoColor
                                        className={className}
                                        key={"second" + amino + i}
                                        amino={amino as AminoAcid}
                                    />
                                </Selectable>
                            </Finding>
                        );
                    }}
                    aligned={alignedSecond}
                    containerWidth={width}
                    position={2}
                />
            </SelectedProvider>
        </div>
    );
};

const RenderPerRow = ({
    containerWidth,
    aligned,
    render,
    position,
    rowClassName,
}: {
    containerWidth: number;
    aligned: string[];
    render: (...props: [string, number]) => ReactNode;
    position: number;
    rowClassName?: string;
}) => {
    const aminoSize = 44;
    const gap = 4;

    const aminoCount = aligned.length;
    const aminoWidth = aminoSize + 2 * gap;
    const allAminosWidth = aminoCount * aminoWidth - 2 * gap;
    const rowCount = Math.ceil(allAminosWidth / containerWidth);
    const elementsInRow = Math.floor(containerWidth / aminoWidth);

    return (
        <>
            {Array.from({ length: rowCount }).map((_, rowIndex) => {
                return (
                    <div
                        key={rowIndex}
                        className={cn(
                            "flex justify-between items-center",
                            rowClassName
                        )}
                        style={{
                            gridRow: `${rowIndex * 2 + position}`,
                        }}
                    >
                        {Array.from({ length: elementsInRow }).map(
                            (_, colIndex) => {
                                const index =
                                    rowIndex * elementsInRow + colIndex;
                                const amino = aligned.at(index)!;
                                if (!amino)
                                    return <React.Fragment key={index} />;
                                return render(amino, index);
                            }
                        )}
                    </div>
                );
                return;
            })}
        </>
    );
};

export default AminoResult;
