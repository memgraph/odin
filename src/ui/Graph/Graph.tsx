import React, { useEffect, useRef, useState } from "react";
import cytoscape, { NodeSingular } from "cytoscape";
import { GraphContainer, GraphStyle } from "./Graph.styles";
import { Node, Edge } from "../../shared/types/graphTypes";
import { LAYOUT } from "../../shared/constants";
import { useApp } from "../hooks/useApp";

interface GraphProps {
	data: {
		nodes: Node[];
		edges: Edge[];
	};
	nodeClickCallback?: (node: NodeSingular) => void;
	type?: string;
	visible: boolean;
	disabled: boolean;
}

const Graph: React.FC<GraphProps> = ({
	data,
	nodeClickCallback,
	type,
	visible,
	disabled,
}) => {
	const [selected, setSelected] = useState<string | undefined>(undefined);
	const cyRef = useRef<cytoscape.Core | null>(null);
	const app = useApp();

	app?.workspace.onLayoutReady(() => {
		app.workspace.on("resize", () => {
			if (cyRef.current) {
				cyRef.current.layout({ name: LAYOUT }).run();
			}
		});
	});

	const registerFileOpenHandler = () => {
		app?.workspace.on("file-open", () => {
			setSelected(app.workspace.activeEditor?.file?.path.split(/(\\|\/)/g).pop());
		});
	};

	const registerNodeClickHandler = () => {
		const handleNodeClick = (event: cytoscape.EventObject) => {
			if (event.target.data().priority === 1) {
				let path = event.target.data().path.split(/(\\|\/)/g).pop();
				setSelected(path);
				app?.workspace.openLinkText("", path);
			}
		};
		cyRef.current?.on("click", "node", handleNodeClick);
	};

	const registerClickHandler = () => {
		const handleClick = (event: cytoscape.EventObject) => {
			cyRef.current?.edges().unselectify();
			if (event.target === cyRef.current) {
				cyRef.current
					?.nodes()
					.filter((node) => node.data().priority === 1)
					.unselectify();
			} else {
				cyRef.current
					?.nodes()
					.filter((node) => node.data().priority === 1)
					.selectify();
			}
		};
		cyRef.current?.on("click", handleClick);
	};

	useEffect(() => {
		const handleNodeClick = (event: cytoscape.EventObject) => {
			if (!disabled && nodeClickCallback) {
				nodeClickCallback(event.target);
			}
		};
		cyRef.current?.on("click", "node", handleNodeClick);
	}, [nodeClickCallback]);

	useEffect(() => {
		console.log("render");
		cyRef.current = cytoscape({
			container: document.getElementById("cy"),
			elements: { nodes: [], edges: [] },
			style: GraphStyle,
			layout: {
				name: LAYOUT,
				fit: true,
				padding: 150,
				spacingFactor: 150,
			},
			minZoom: 0.3,
			maxZoom: 2,
		});

		registerFileOpenHandler();
		registerNodeClickHandler();
		registerClickHandler();

		return () => {
			console.log("destroy");
			cyRef.current?.destroy();
		};
	}, []);

	useEffect(() => {
		console.log("refreshing");
		const refreshGraph = () => {
			if (cyRef.current) {
				cyRef.current.elements().remove();
				cyRef.current.add([...data.nodes, ...data.edges]);
				cyRef.current.layout({ name: LAYOUT }).run();
			}
			cyRef.current?.resize();
		};

		console.log("refresh");
		refreshGraph();
	}, [data]);

	useEffect(() => {
		if (cyRef.current && data.nodes) {
			cyRef.current.batch(() => {
				cyRef.current?.nodes().forEach((node) => {
					const nodeData = node.data();
					if (nodeData.priority !== 1) node.unselectify();
					if (
						(nodeData.path.split(/(\\|\/)/g).pop() === selected && type !== "file") ||
						(nodeData.selected && type === "file")
					) {
						node.select();
					} else {
						node.deselect();
					}
				});
			});
		}
	}, [data, selected]);

	return <GraphContainer id="cy" $visible={visible} />;
};

export default Graph;
