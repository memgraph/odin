import { Loader2 } from "lucide-react";
import { AnimatedRotate } from "src/shared/animations";
import { styled } from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-4-4);
`;

export const LoadingIcon = styled(Loader2)`
    ${AnimatedRotate};
    width: var(--size-4-8);
    height: var(--size-4-8);
    color: var(--color-accent-1);
`;

export const LoadingContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
`;

export const GlobalLoadingContainer = styled.div`
    width: var(--size-4-12);
    height: var(--size-4-12);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: var(--size-4-3);
    right: var(--size-4-3);
    border-radius: var(--tab-radius);
    background-color: var(--color-base-00);
    border: 1px solid var(--divider-color);
`;