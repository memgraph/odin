import React, { useEffect, useState } from "react";
import Graph from "../Graph/Graph";
import PromptBar from "../PromptBar/PromptBar";
import * as S from "./Main.styles";
import { useApp } from "../hooks/useApp";
import { Edge, Node } from "src/shared/types/graphTypes";
import RadioSelect from "../RadioSelect/RadioSelect";
import { Archive, FileBarChart2 } from "lucide-react";
import { fetchData } from "src/util/fetchData";
import { FileSystemAdapter } from "obsidian";
import shortenWord from "src/util/shortenWord";
import getEditorPosition from "src/util/getEditorPosition";

const OPERATIONS = ["create", "delete", "modify", "rename"];
const DEFAULT_SELECTION = "vault";
const operationsMap: Record<string, { url: string; method: string }> = {
	create: { url: "add", method: "PUT" },
	modify: { url: "update", method: "PUT" },
	delete: { url: "delete", method: "DELETE" },
};

const Main: React.FC = (): React.JSX.Element => {
	const app = useApp();
	const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] }>({
		nodes: [],
		edges: [],
	});
	const [type, setType] = useState<string>(DEFAULT_SELECTION);
	const [suggested, setSuggested] = useState<number[]>([]);
	const [selectedFile, setSelectedFile] = useState<string>(
		app?.workspace.activeEditor?.file?.path || ""
	);

	const options = [
		{ label: <Archive />, value: "vault", text: "Vault view" },
		{ label: <FileBarChart2 />, value: "file", text: "File view" },
	];

	const root =
		app?.vault.adapter instanceof FileSystemAdapter
			? app.vault.adapter.getBasePath().replaceAll("\\", "/")
			: "/";

	const onChangeCallback = (value: string): void => {
		setType(value);
	};

	const onNodeClickCallback = async (node: any) => {
		if (suggested.length > 0) setSuggested([]);
		if (type === "file") {
			console.log(node.data());
			const fetchBody = {
				repo: {
					path: root,
					type: "Notes",
				},
				id: node.data().id,
			};

			await fetchData(
				"http://localhost:8000/knowledge_base/notes/node_to_sentences",
				fetchBody
			).then((data) => {
				console.log(data);
				const selections: any = [];
				data.forEach((element: any) => {
					selections.push(
						getEditorPosition(
							app?.workspace.activeEditor?.editor?.getValue() ||
								"",
							element.content
						)
					);
				});
				app?.workspace.activeEditor?.editor?.setSelections(selections);
			});
		}
	};

	const predictLinks = async (file: string) => {
		const fetchBody = {
			repo: {
				path: root + "/" + file,
				type: "Notes",
			},
			content: app?.workspace.activeEditor?.editor?.getSelection() || "",
		};
		console.log(fetchBody);
		await fetchData(
			"http://localhost:8000/knowledge_base/notes/suggest_link",
			fetchBody
		).then((data) => {
			// TODO
			console.log(data);
		});
	};

	const nodeSuggest = async (text: string) => {
		const fetchBody = {
			repo: {
				path: root,
				type: "Notes",
			},
			content: text,
		};

		await fetchData(
			"http://localhost:8000/knowledge_base/notes/sentence_to_nodes",
			fetchBody
		).then((data) => {
			console.log(data);
			setSuggested(data.map((node: any) => node.id));
			setType("file");
			console.log(data.map((node: any) => node.id));
		});
	};

	const commands = [
		{
			title: "Link prediction",
			icon: "file-symlink",
			callback: predictLinks,
			data: "path",
		},
		{
			title: "Node suggestion",
			icon: "hexagon",
			callback: nodeSuggest,
			data: "selection",
		},
	];

	const handleFileEvent = (operation: string) => (file: string) => {
		const fetchBody = {
			path: root + "/" + file,
			type: "Notes",
			content: "",
		};

		fetchData(
			`http://localhost:8000/knowledge_base/notes/${operationsMap[operation].url}_file`,
			fetchBody,
			operationsMap[operation].method
		);
		populateGraphData();
	};

	const populateGraphData = async () => {
		const nodeList: Node[] = [];
		const edgeList: Edge[] = [];

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

		await fetchData(fetchUrl, fetchBody).then((data) => {
			data.forEach((element: any) => {
				if (element.type === "node") {
					const fileName = element.properties.file_path.replace(
						root + "/",
						""
					);
					nodeList.push({
						data: {
							id: element.id,
							label: shortenWord(element.properties.name, 12),
							priority: 1,
							selected:
								(type !== "file" &&
									selectedFile === fileName) ||
								suggested.contains(parseInt(element.id)),
							path: fileName,
						},
					});
				} else if (element.type === "relationship") {
					edgeList.push({
						data: {
							id: element.id,
							source: element.start,
							target: element.end,
						},
					});
				}
			});
		});

		console.log(nodeList);
		setData({ nodes: nodeList, edges: edgeList });
	};

	useEffect(() => {
		populateGraphData();
	}, [selectedFile, suggested, type]);

	useEffect(() => {
		fetchData("http://localhost:8000/knowledge_base/general/init_repo", {
			path: root,
			type: "Notes",
		});

		OPERATIONS.forEach((op: any) => {
			app?.vault.on(op, (file) => {
				if (op !== "rename") handleFileEvent(op)(file.path);
				populateGraphData();
			});
		});

		app?.workspace.on("file-open", () => {
			setSelectedFile(app.workspace.activeEditor?.file?.path || "");
		});

		commands.forEach((command) => {
			app?.workspace.on("editor-menu", (menu) => {
				menu.addItem((item) => {
					item.setTitle(command.title)
						.setIcon(command.icon)
						.onClick(() => {
							if (command.callback) {
								let arg =
									app.workspace.activeEditor?.file?.path;
								if (command.data === "selection")
									arg =
										app.workspace.activeEditor?.editor?.getSelection();
								command.callback(arg || "");
							}
						});
				});
			});
		});

		populateGraphData();
	}, []);

	return (
		<S.Container>
			<RadioSelect
				options={options}
				defaultSelectedValue="vault"
				selectedValueOverride={type}
				onChange={onChangeCallback}
				disabled={selectedFile.length === 0}
			/>
			<Graph
				data={data}
				nodeClickCallback={onNodeClickCallback}
				type={type}
			/>
			<PromptBar />
		</S.Container>
	);
};

export default Main;
