import { Edge, Node } from "src/shared/types/graphTypes";
import { fetchData } from "src/util/fetchData";
import shortenWord from "src/util/shortenWord";

export const fetchGraphData = async (type: string, root: string, selectedFile: string, ignoreResults: boolean, suggested: number[]): Promise<{ nodes: Node[], edges: Edge[] }> => {
    let fetchBody = {};
    const fetchUrl =
        type === "vault"
            ? "http://localhost:8000/knowledge_base/general/get_all_for_repo"
            : "http://localhost:8000/knowledge_base/notes/get_for_path";

    if (type === "vault") {
        fetchBody = {
            path: root,
            type: "Notes",
        };
    } else if (type === "file" && selectedFile) {
        fetchBody = {
            path: root + "/" + selectedFile,
            type: "Notes",
            content: "",
        };
    }

    const nodeList: Node[] = [];
    const edgeList: Edge[] = [];

    console.log("fetching");
    await fetchData(fetchUrl, fetchBody)
        .then((data) => {
            if (!ignoreResults) {
                if (data && data.length > 0) {
                    console.log(data);
                    data.forEach((element: any) => {
                        if (element.type === "node") {
                            const fileName =
                                element.properties.file_path.replace(
                                    root + "/",
                                    ""
                                );
                            nodeList.push({
                                data: {
                                    id: element.id,
                                    label: shortenWord(
                                        element.properties.name,
                                        12
                                    ),
                                    priority: 1,
                                    selected:
                                        (type !== "file" &&
                                            selectedFile === fileName) ||
                                        suggested.contains(
                                            parseInt(element.id)
                                        ),
                                    path: fileName,
                                },
                            });
                        } else if (element.type === "relationship") {
                            edgeList.push({
                                data: {
                                    id: element.id,
                                    label: shortenWord(element.label, 12),
                                    source: element.start,
                                    target: element.end,
                                },
                            });
                        }
                    });
                }
            }
        });

    return { nodes: nodeList, edges: edgeList }
}