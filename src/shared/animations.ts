import { styled, keyframes } from "styled-components";

const rotate = keyframes`
    from {
        transform: rotate(360deg);
    }
`;

export const AnimatedRotate = styled.div`
    animation: ${rotate} 2s linear infinite;
`;