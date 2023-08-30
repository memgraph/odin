import styled, { css } from "styled-components";
import { MoveRight, Loader2, RotateCw, Share2, User2 } from "lucide-react";
import { AnimatedRotate } from "src/shared/animations";

interface PromptDropDownProps {
    $isVisible: boolean;
}

interface PromptIconBlockProps {
    disabled: boolean;
}

interface PromptDropDownPromptProps {
    disabled: boolean;
}

export const PromptContainer = styled.div`
    width: 95%;
    height: 64px;
    position: relative;
    margin-bottom: var(--size-4-4);
    border-radius: var(--size-4-4);
    border: 1px solid var(--color-base-30);
    background-color: var(--color-base-10);
`;

export const PromptLabel = styled.label`
    width: 100%;
    height: 100%;
    display: flex;
`;

export const PromptArea = styled.textarea`
    width: 85%;
    height: 100%;
    z-index: 5;
    display: table-cell;
    vertical-align: middle;
    padding: var(--size-4-4);
    padding-top: 0;
    border: none;
    outline: none;
    border-radius: var(--size-4-4) 0 0 var(--size-4-4);
    font-size: var(--font-small);
    resize: none;
    background-color: var(--color-base-10);
    color: var(--color-base-100);

    &:active, &:focus {
        box-shadow: none;
        border: none;
    }

    @media only screen and (max-width: 968px) {
        padding: var(--size-4-2);
    }
`;

export const PromptButtonContainer = styled.div`
    width: 15%;
    height: 100%;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-base-10);
    border-radius: 0 var(--size-4-4) var(--size-4-4) 0;
`;

const AnimatedIcon = css`
    cursor: pointer;
    transition: 0.2s transform;

    &:hover {
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const PromptSendBlock = styled.div<PromptIconBlockProps>`
    ${props => props.disabled ? null : AnimatedIcon}
    width: var(--size-4-6);
    height: var(--size-4-6);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--size-4-2);
    border-radius: var(--size-4-2);
    background-color: var(--color-accent-1);
    color: var(--color-base-90);
`;

export const PromptSendIcon = styled(MoveRight)`
    transform: scale(1.5);
`;

export const PromptDropDown = styled.div<PromptDropDownProps>`
    width: calc(100% + 2px);
    height: ${props => (props.$isVisible ? "fit-content" : 0)};
    max-height: 70vh;
    padding: ${props => (props.$isVisible ? "var(--size-4-4)" : 0)};
    position: absolute;
    bottom: calc(100% - var(--size-4-4));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: var(--size-4-6);
    left: -1px;
    overflow-y: auto;
    border-radius: var(--size-4-4) var(--size-4-4) 0 0;
    border: 1px solid var(--color-base-30);
    border-bottom: none;
    background-color: var(--color-base-10);
    transition: 0.5s all;

    & > * {
        display: ${props => (props.$isVisible ? "flex" : "none")};
    }

    @media only screen and (max-width: 968px) {
        height: ${props => (props.$isVisible ? "auto" : "var(--size-4-4)")};
        max-height: 62vh;
        padding: ${props => (props.$isVisible ? "var(--size-4-2)" : 0)};
    }
`;

export const PromptDropDownMessages = styled.div`
    width: 100%;
    flex-direction: column;
`;

export const LoadingIcon = styled(Loader2)`
    ${AnimatedRotate};
    width: var(--size-4-8);
    height: var(--size-4-8);
    color: var(--color-accent-1);
`;

export const PromptDropDownInfo = styled.div`
    width: 100%;
    flex-direction: column;
    gap: var(--size-4-4);
    justify-content: center;
    align-items: center;
    margin-bottom: var(--size-4-2);
`;

export const PromptDropDownError = styled.div`
    width: auto;
    padding: var(--size-4-4);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-4-4);
    border-radius: var(--size-4-4);
    border: 1px solid var(--color-red);
    color: var(--color-base-100);
`;

export const PromptDropDownRegenerateBlock = styled.div`
    ${AnimatedIcon}
    padding: var(--size-4-2);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-4-4);
    background-color: var(--color-accent-1);
    border-radius: var(--size-4-2);
    transition: 0.2s transform;

    &:hover {
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.98);
    }

    &:hover > * {
        transform: rotate(45deg);
    }

    &:active > * {
        transform: rotate(90deg);
    }
`;

export const PromptDropDownRegenerateIcon = styled(RotateCw)`
    width: var(--size-4-4);
    height: var(--size-4-4);
    color: var(--color-base-90);
    transition: 0.2s all;
`;

export const PromptDropDownPrompts = styled.div`
    width: 100%;
    height: auto;
    padding: var(--size-4-4) 0;
    margin-bottom: var(--size-2-1);
    overflow: initial;
    flex-wrap: wrap;
    gap: var(--size-4-4);
`;

export const PromptDropDownPrompt = styled.div<PromptDropDownPromptProps>`
    padding: var(--size-4-2);
    border: 1px solid var(--color-base-30);
    border-radius: var(--size-4-4);
    color: var(--color-base-100);
    transition: 0.2s all;
    cursor: ${props => props.disabled ? "default" : "pointer"};

    &:hover {
        background-color: ${props => props.disabled ? "inherit" : "var(--color-base-30)"};
    }

    &:active {
        transform: ${props => props.disabled ? null : "scale(0.98)"};
    }
`;

const ChatIcon = css`
    width: var(--size-4-4);
    height: var(--size-4-4);
`;

export const ChatUserIcon = styled(User2)`
    ${ChatIcon};
`;

export const ChatLLMIcon = styled(Share2)`
    ${ChatIcon};
`;

export const PromptDropDownMessage = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: flex-start;
    gap: var(--size-4-2);
    margin: var(--size-4-6) 0;
    color: var(--color-base-100);
`;

export const PromptIconBlock = styled.div`
    width: var(--size-4-6);
    height: var(--size-4-6);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-base-100);
    background-color: var(--color-accent-1);
`;

export const PromptTextBlock = styled.div`
    width: 80%;
    word-wrap: break-word;
`;