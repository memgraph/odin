export interface GraphEdge {
    id: number,
    label: string,
    start: number,
    end: number,
    properties: {
        file_path: string,
        repo_path: string,
    },
    type: string,
}