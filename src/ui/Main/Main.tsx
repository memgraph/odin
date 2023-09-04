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
import getEditorPosition from "src/util/getEditorPosition";
import * as Messages from "src/shared/messages";
import { fetchGraphData } from "./MainUtils";
import * as Constants from "src/shared/constants";
import { NodeSingular } from "cytoscape";
import { AnalyticsNode } from "src/model/AnalyticsNode";
import { Selection } from "src/shared/types/Selection";
import { Sentence } from "src/model/Sentence";
import getFilenameFromPath from "src/util/getFilenameFromPath";

const Main: React.FC = (): React.JSX.Element => {
	const app = useApp();
	const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] }>({
		nodes: [],
		edges: [],
	});
	const [type, setType] = useState<string>(Constants.DEFAULT_SELECTION);
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

	const onNodeClickCallback = async (node: NodeSingular) => {
		let ignoreResults = false;
		if (type === "file") {
			setDisabled(true);
			const active = selectedFile;
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
			)
				.then((data) => {
					const selections: Selection[] = [];
					data.forEach((element: Sentence) => {
						selections.push(
							getEditorPosition(
								app?.workspace.activeEditor?.editor?.getValue() ||
									"",
								element.content
							)
						);
					});

					if (active === selectedFile && !ignoreResults)
						app?.workspace.activeEditor?.editor?.setSelections(
							selections
						);
				})
				.catch(() => {
					new Notice(Messages.fetchFailed);
				});
			setDisabled(false);
		}

		return () => {
			ignoreResults = true;
		};
	};

	const predictLinks = async (file: string) => {
		if (!app?.workspace.activeEditor?.editor?.getSelection()) {
			new Notice(Messages.noSelectedText);
			return;
		}

		let ignoreResults = false;
		const active = selectedFile;
		setDisabled(true);
		const fetchBody = {
			repo: {
				path: root,
				type: "Notes",
			},
			content: app?.workspace.activeEditor?.editor?.getSelection() || "",
		};
		console.log(fetchBody);
		await fetchData(
			"http://localhost:8000/knowledge_base/notes/suggest_link",
			fetchBody
		)
			.then((data) => {
				const pos = getEditorPosition(
					app.workspace.activeEditor?.editor?.getValue() || "",
					app.workspace.activeEditor?.editor?.getSelection().trim() ||
						""
				).head;
				pos.ch++;

				if (pos && active === selectedFile && !ignoreResults)
					app.workspace.activeEditor?.editor?.replaceRange(
						`[[${getFilenameFromPath(data.path).split(".")[0]}]] `,
						pos,
						pos
					);
			})
			.catch(() => {
				new Notice(Messages.fetchFailed);
			});
		setDisabled(false);

		return () => {
			ignoreResults = true;
		};
	};

	const nodeSuggest = async (text: string) => {
		console.log("disabled:");
		console.log(disabledRef.current);
		if (disabledRef.current) {
			new Notice(Messages.loadingText);
			return;
		}

		if (text.length === 0) {
			new Notice(Messages.noSelectedText);
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
		)
			.then((data) => {
				console.log("fetched nodes data: ");
				console.log(data);
				setSuggested(data.map((node: AnalyticsNode) => node.id));
				if (type !== "file") {
					setType("file");
				} else {
					populateGraphData(false);
				}
			})
			.catch(() => {
				new Notice(Messages.fetchFailed);
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
				`http://localhost:8000/knowledge_base/notes/${Constants.OPERATIONS_MAP[operation].url}_file`,
				fetchBody,
				Constants.OPERATIONS_MAP[operation].method
			).catch(() => {
				new Notice(Messages.updateFailed);
			});
			populateGraphData(false);
		};

	const populateGraphData = async (reload: boolean) => {
		let ignoreResults = false;
		setDisabled(true);
		if (reload) setGraphLoading(true);

		await fetchGraphData(type, root, selectedFile, ignoreResults, suggested)
			.then((data) => {
				setData(data);
			})
			.catch(() => {
				new Notice(Messages.fetchFailed);
			});

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

		Constants.OPERATIONS.forEach((op: "rename") => {
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
			{disabled && !graphLoading && (
				<S.GlobalLoadingContainer>
					<S.LoadingIcon />
				</S.GlobalLoadingContainer>
			)}
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
