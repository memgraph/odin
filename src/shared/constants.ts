export const LAYOUT = "circle";

export const OPERATIONS_MAP: Record<string, { url: string; method: string }> = {
    create: { url: "add", method: "PUT" },
    modify: { url: "update", method: "PUT" },
    rename: { url: "rename", method: "POST" },
    delete: { url: "delete", method: "DELETE" },
};

export const OPERATIONS = ["create", "delete", "modify", "rename"];

export const DEFAULT_SELECTION = "vault";