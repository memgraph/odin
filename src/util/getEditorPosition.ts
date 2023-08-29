import { Selection } from "src/shared/types/Selection";

const getEditorPosition = (file: string, data: string): Selection => {
    const lines = file.split("\n");
    let index = file.search(data);
    let total = 0;
    let anchor: { ch: number, line: number } = { ch: 0, line: 0 };
    let head: { ch: number, line: number } = { ch: 0, line: 0 };

    for (let i = 0; i < lines.length; i++) {
        total += lines[i].length;
        if (lines[i].length === 0) total += 2
        if (total > index) {
            anchor = {
                ch: lines[i].length - total + index,
                line: i
            }
            break;
        }
    }

    index += data.length;
    total = 0;

    for (let i = 0; i < lines.length; i++) {
        total += lines[i].length;
        if (lines[i].length === 0) total += 2
        if (total > index) {
            head = {
                ch: lines[i].length - total + index,
                line: i
            }
            break;
        }
    }

    return { anchor, head };
}

export default getEditorPosition;