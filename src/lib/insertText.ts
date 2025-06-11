export function insertText(
    original: string,
    textToInsert: string,
    position: number
) {
    console.log(position);
    console.log(original);
    console.log(original.at(position));

    if (original.at(position) === "-") {
        return (
            original.substring(0, position).padEnd(position, "-") +
            textToInsert +
            original.substring(position + 1)
        );
    }

    return (
        original.substring(0, position).padEnd(position, "-") +
        textToInsert +
        original.substring(position)
    );
}
