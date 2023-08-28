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
    width: var(--size-4-8);
    height: var(--size-4-8);
    color: var(--color-accent-1);
`;

export const LoadingContainer = styled(AnimatedRotate)`
    position: absolute;
    top: 50%;
    left: 50%;
`;