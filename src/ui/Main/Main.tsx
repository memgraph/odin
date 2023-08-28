import React, { useEffect, useRef, useState } from "react";
import Graph from "../Graph/Graph";
import PromptBar from "../PromptBar/PromptBar";
import * as S from "./Main.styles";
import { useApp } from "../hooks/useApp";
import { Edge, Node } from "src/shared/types/graphTypes";
import RadioSelect from "../RadioSelect/RadioSelect";
import { Archive, FileBarChart2 } from "lucide-react";
import { fetchData } from "src/util/fetchData";
import { FileSystemAdapter, Notice, TAbstractFile } from "obsidian";
import shortenWord from "src/util/shortenWord";
import getEditorPosition from "src/util/getEditorPosition";
import { loadingText, noSelectedText } from "src/shared/constants";

const OPERATIONS = ["create", "delete", "modify", "rename"];
const DEFAULT_SELECTION = "vault";
const operationsMap: Record<string, { url: string; method: string }> = {
	create: { url: "add", method: "PUT" },
	modify: { url: "update", method: "PUT" },
	rename: { url: "rename", method: "POST" },
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
	const [graphLoading, setGraphLoading] = useState<boolean>(false);
	const [firstRender, setFirstRender] = useState<boolean>(true);
	const [disabled, setDisabled] = useState<boolean>(true);
	const disabledRef = useRef<boolean>(true);

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
		if (type === "file") {
			if (suggested.length > 0) setSuggested([]);
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
		console.log("disabled:");
		console.log(disabledRef.current);
		if (disabledRef.current) {
			new Notice(loadingText);
			return;
		}

		if (text.length === 0) {
			new Notice(noSelectedText);
			return;
		}

		setDisabled(true);
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
			if (type !== "file") {
				setType("file");
			} else {
				populateGraphData(false);
			}
		});
		setDisabled(false);
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

	const handleFileEvent =
		(operation: string) => (file: TAbstractFile, oldPath?: string) => {
			let fetchBody;
			if (operation === "rename") {
				fetchBody = {
					old_file: { path: oldPath, type: "Notes", content: "" },
					new_file: { path: file.path, type: "Notes", content: "" },
				};
			} else {
				fetchBody = {
					path: root + "/" + file.path,
					type: "Notes",
					content: "",
				};
			}

			fetchData(
				`http://localhost:8000/knowledge_base/notes/${operationsMap[operation].url}_file`,
				fetchBody,
				operationsMap[operation].method
			);
			populateGraphData(false);
		};

	const populateGraphData = async (reload: boolean) => {
		let ignoreResults = false;
		setDisabled(true);
		if (reload) setGraphLoading(true);
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

		console.log("fetching");
		await fetchData(fetchUrl, fetchBody).then((data) => {
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
									source: element.start,
									target: element.end,
								},
							});
						}
					});
				}
			}
		});

		console.log(nodeList);
		setData({ nodes: nodeList, edges: edgeList });
		setGraphLoading(false);
		console.log("repopulated");
		setDisabled(false);
		console.log(disabled || selectedFile.length === 0);

		return () => {
			ignoreResults = true;
		};
	};

	useEffect(() => {
		disabledRef.current = disabled;
	}, [disabled]);

	useEffect(() => {
		if (!firstRender) populateGraphData(false);
	}, [selectedFile]);

	useEffect(() => {
		if (!firstRender) populateGraphData(true);
	}, [type]);

	useEffect(() => {
		setDisabled(true);
		const initRepo = async () => {
			await fetchData(
				"http://localhost:8000/knowledge_base/general/init_local_repo",
				{
					path: root,
					type: "Notes",
				}
			);
		};

		initRepo();

		OPERATIONS.forEach((op: any) => {
			app?.vault.on(op, (file, oldPath?: string) => {
				if (op === "rename") {
					handleFileEvent(op)(file, oldPath);
				} else {
					handleFileEvent(op)(file);
				}
				populateGraphData(false);
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

		populateGraphData(true);
		setDisabled(false);
		setFirstRender(false);
	}, []);

	return (
		<S.Container>
			<RadioSelect
				options={options}
				defaultSelectedValue="vault"
				selectedValueOverride={type}
				onChange={onChangeCallback}
				disabled={selectedFile.length === 0 || disabled}
			/>
			<Graph
				data={data}
				nodeClickCallback={onNodeClickCallback}
				type={type}
				visible={!graphLoading}
				disabled={disabled}
			/>
			{graphLoading && (
				<S.LoadingContainer>
					<S.LoadingIcon />
				</S.LoadingContainer>
			)}
			<PromptBar />
		</S.Container>
	);
};

export default Main;
