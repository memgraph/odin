import React from "react";
import { App } from "obsidian";
import { AppContext } from "src/shared/appContext";

export const useApp = (): App | undefined => {
    return React.useContext(AppContext);
};