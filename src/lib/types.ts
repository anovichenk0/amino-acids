export type StringToUnion<S extends string> =
    S extends `${infer First}${infer Rest}`
        ? First | StringToUnion<Rest>
        : never;

const groups = {
    cysteine: "C",
    hydrophobic: "AILMFWYVP",
    glycine: "G",
    negative: "DE",
    positive: "KR",
    polar: "STHQN",
} as const;

type GroupKey = keyof typeof groups;
type GroupValue = (typeof groups)[GroupKey];
export type AminoAcid = StringToUnion<GroupValue>;

const aminoToGroup = {} as Record<AminoAcid, GroupKey>;
(Object.entries(groups) as [GroupKey, GroupValue][]).forEach(
    ([group, aminos]) => {
        (aminos.split("") as AminoAcid[]).forEach((amino) => {
            aminoToGroup[amino] = group;
        });
    }
);

export { aminoToGroup, groups };
