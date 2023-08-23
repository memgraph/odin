import styled, { css } from "styled-components";

interface RadioLabelProps {
    selected: boolean;
    disabled: boolean;
}

export const RadioContainer = styled.div`
    display: flex;
    border: 1px solid var(--divider-color);
    border-radius: var(--tab-radius);
`;

export const RadioLabel = styled.label<RadioLabelProps>`
    display: flex;
    align-items: center;
    gap: var(--size-2-2);
    padding: 8px;
    background-color: ${props => props.selected ? "var(--divider-color)" : "var(--color-base-00)"};
    border-right: 1px solid var(--divider-color);
    transition: background-color 0.3s;
    cursor: ${props => props.disabled ? "not-allowed" : "pointer"};

    ${props => !props.disabled && css`
        &:hover {
            color: var(--icon-color-focused);
            background-color: var(--color-base-40);
        }
    `}
    

    &:first-child {
        border-radius: var(--tab-radius) 0 0 var(--tab-radius);
    }

    &:last-child {
        border-right: none;
        border-radius: 0 var(--tab-radius) var(--tab-radius) 0;
    }
`;

export const RadioInput = styled.input`
    display: none;
    color: var(--icon-color);
`;