import { keyframes, css } from "styled-components";

const rotate = keyframes`
    from {
        transform: rotate(360deg);
    }
`;

export const AnimatedRotate = css`
    animation: ${rotate} 2s linear infinite;
`;