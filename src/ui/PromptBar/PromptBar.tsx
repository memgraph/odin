import { useEffect, useRef, useState } from "react";
import * as S from "./PromptBar.styles";
import { fetchData } from "../../util/fetchData";
import { useApp } from "../hooks/useApp";
import { FileSystemAdapter } from "obsidian";

interface PromptBarProps {
	submitCallback?: (value: string) => void;
	prompts?: { [shortcut: string]: string };
	prompt?: string;
}

const PromptBar: React.FC<PromptBarProps> = ({
	submitCallback,
	prompts,
	prompt,
}) => {
	const [value, setValue] = useState<string>("");
	const [chat, setChat] = useState<string[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [type, setType] = useState<number>(0);
	const [content, setContent] = useState<string>("");
	const app = useApp();

	const inputElement = useRef<HTMLLabelElement>(null);
	const elementBottom = useRef<HTMLDivElement | null>(null);
	const disabled = useRef<boolean>(false);
	const scrollToBottom = () => {
		elementBottom?.current?.scroll({
			behavior: "smooth",
			top: elementBottom?.current?.scrollHeight,
		});
	};

	const generateQuestions = (file: string) => {
		console.log(disabled);
		if (!disabled.current)
			handleSubmit(false, 1, `Generate questions for ${file}`);
	};

	const command = {
		title: "Generate questions",
		icon: "atom",
		callback: generateQuestions,
	};

	useEffect(() => {
		app?.workspace.on("editor-menu", (menu) => {
			menu.addItem((item) => {
				item.setTitle(command.title)
					.setIcon(command.icon)
					.onClick(() => {
						if (command.callback)
							command.callback(
								app.workspace.activeEditor?.file?.basename || ""
							);
					});
			});
		});
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [chat, visible, loading, error]);

	useEffect(() => {
		if (prompt) {
			setValue(prompt);
			inputElement.current?.focus();
		}
	}, [prompt]);

	const handleInputChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setValue(event.target.value);
	};

	const handleSubmit = async (
		regen: boolean,
		type: number,
		valueOverride?: string
	) => {
		disabled.current = true;
		if (submitCallback) {
			submitCallback(value);
		}
		let val = valueOverride || value;
		setValue("");
		setType(type);
		if (val.trim() || regen) {
			if (!regen) {
				setChat((prevChat) => [...prevChat, val]);
			} else if (!error) {
				val = chat[chat.length - 2];
				setChat((prevChat) => prevChat.slice(0, -1));
			}
			setVisible(true);
			setLoading(true);
			setError(false);
			setErrorMsg("");
			let fetchUrl: string;
			let fetchBody = {};
			if (type === 0) {
				const adapter = app?.vault.adapter;
				let root = "";
				if (adapter instanceof FileSystemAdapter)
					root = adapter.getBasePath().replaceAll("\\", "/");
				fetchUrl = "http://localhost:8000/knowledge_base/general/ask";
				fetchBody = {
					repo: {
						path: root,
						type: "Notes",
					},
					prompt: val,
					type: "Notes",
				};
			} else {
				if (app?.workspace.activeEditor?.editor?.getValue())
					setContent(
						app?.workspace.activeEditor?.editor?.getValue() || ""
					);
				fetchUrl =
					"http://localhost:8000/knowledge_base/text_analizer/notes/generate_questions";
				fetchBody = {
					content:
						app?.workspace.activeEditor?.editor?.getValue() ||
						content,
				};
			}
			await fetchData(fetchUrl, fetchBody)
				.then((data) => {
					let content = data.content;
					console.log(type);
					if (type === 1) {
						const divider = "<research_questions>";
						content = content.slice(
							content.indexOf(divider) + divider.length
						);
					}
					setChat((prevChat) => [...prevChat, content]);
				})
				.catch((e) => {
					setError(true);
					setErrorMsg(e.message);
				});
			setLoading(false);
		}
		setType(type);
		setTimeout(() => {
			inputElement.current?.focus();
		}, 0);
		disabled.current = false;
	};

	const handlePromptClick = (msg: string) => {
		if (!loading && !error && !disabled) {
			setValue(msg);
			setTimeout(() => {
				inputElement.current?.focus();
			}, 0);
		}
	};

	const handleKeyPress = (
		event: React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSubmit(false, 0);
		}
	};

	const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
		if (prompts || chat.length > 0) setVisible(true);
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const currentTarget = event.currentTarget;
		requestAnimationFrame(() => {
			if (!currentTarget.contains(document.activeElement)) {
				setVisible(false);
			}
		});
	};

	return (
		<S.PromptContainer
			onFocus={handleFocus}
			onBlur={handleBlur}
			tabIndex={0}
		>
			<S.PromptLabel htmlFor="prompt" ref={inputElement}>
				<S.PromptArea
					id="prompt"
					value={value}
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
					placeholder="Type your query here"
					disabled={loading || error}
				/>
				<S.PromptButtonContainer>
					<S.PromptSendBlock
						onClick={() => handleSubmit(false, 0)}
						disabled={loading || error}
					>
						<S.PromptSendIcon />
					</S.PromptSendBlock>
				</S.PromptButtonContainer>
			</S.PromptLabel>
			<S.PromptDropDown $isVisible={visible} ref={elementBottom}>
				<S.PromptDropDownMessages>
					{chat.map((msg, index) => {
						return (
							<S.PromptDropDownMessage key={msg + index}>
								<S.PromptIconBlock>
									{index % 2 !== 0 ? (
										<S.ChatLLMIcon />
									) : (
										<S.ChatUserIcon />
									)}
								</S.PromptIconBlock>
								<S.PromptTextBlock>{msg}</S.PromptTextBlock>
							</S.PromptDropDownMessage>
						);
					})}
				</S.PromptDropDownMessages>
				{chat.length > 0 ? (
					<S.PromptDropDownInfo>
						{loading ? <S.LoadingIcon /> : null}
						{error ? (
							<>
								<S.PromptDropDownError>
									{errorMsg}
								</S.PromptDropDownError>
								<S.PromptDropDownRegenerateBlock
									onClick={() => handleSubmit(true, type)}
								>
									<S.PromptDropDownRegenerateIcon />
									Regenerate response
								</S.PromptDropDownRegenerateBlock>
							</>
						) : null}
						{!loading && !error ? (
							<S.PromptDropDownRegenerateBlock
								onClick={() => handleSubmit(true, type)}
							>
								<S.PromptDropDownRegenerateIcon />
								Regenerate response
							</S.PromptDropDownRegenerateBlock>
						) : null}
					</S.PromptDropDownInfo>
				) : null}
				{prompts ? (
					<S.PromptDropDownPrompts>
						{Object.keys(prompts).map((prompt) => {
							return (
								<S.PromptDropDownPrompt
									key={prompt}
									onClick={() =>
										handlePromptClick(prompts[prompt])
									}
									disabled={loading || error}
								>
									{prompt}
								</S.PromptDropDownPrompt>
							);
						})}
					</S.PromptDropDownPrompts>
				) : null}
			</S.PromptDropDown>
		</S.PromptContainer>
	);
};

export default PromptBar;
