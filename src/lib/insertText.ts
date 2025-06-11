export function insertText(
    original: string,
    textToInsert: string,
    position: number
) {
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
