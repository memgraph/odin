export interface GraphNode {
    id: number,
    labels: string[],
    properties: {
        embeddings: number[],
        file_path: string,
        repo_path: string,
        name: string,
    },
    type: string,
}