import { ItemView, Plugin, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './ui/Main/Main';
import { Edge, Node } from './shared/types/graphTypes';
import { AppContext } from './shared/appContext';

const VIEW_TYPE = "graph-prompt-view";
export const CONTAINER_ID = "graph-prompt-container";

class GraphPromptView extends ItemView {
    private reactComponent: React.ReactElement;
    private nodes: Node[] = [];
    private edges: Edge[] = [];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Graph Prompt View";
    }

    getIcon(): string {
        return "share-2";
    }

    async onOpen() {
        this.reactComponent = React.createElement(AppContext.Provider, { value: this.app }, React.createElement(Main));
        ReactDOM.render(this.reactComponent, this.contentEl);
        this.contentEl.id = CONTAINER_ID;
    }

    async onClose() {
        ReactDOM.unmountComponentAtNode(this.contentEl);
    }
}

interface MagicGraphPluginSettings {
    mySetting: string;
}

export default class MagicGraphPlugin extends Plugin {
    settings: MagicGraphPluginSettings;
    private view: GraphPromptView;

    async onload() {
        console.log("Loading magic-graph plugin");

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => (this.view = new GraphPromptView(leaf))
        );

        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
    }

    onunload() {
        console.log("Unloading magic-graph plugin");
    }

    onLayoutReady(): void {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE,
        });
    }
}