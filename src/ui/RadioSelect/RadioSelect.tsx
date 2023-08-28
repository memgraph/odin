import React, { useEffect, useState } from "react";
import * as S from "./RadioSelect.styles";

interface OptionProps {
	label: JSX.Element;
	value: string;
	text: string;
}

interface RadioSelectProps {
	options: OptionProps[];
	defaultSelectedValue: string;
	selectedValueOverride?: string;
	disabled: boolean;
	onChange?: (value: string) => void;
}

const RadioSelect: React.FC<RadioSelectProps> = ({
	options,
	defaultSelectedValue,
	selectedValueOverride,
	disabled,
	onChange,
}) => {
	const [selectedValue, setSelectedValue] = useState(defaultSelectedValue);

	const handleOptionChange = (value: string) => {
		if (!disabled) {
			setSelectedValue(value);
			if (onChange) onChange(value);
		}
	};

	useEffect(() => {
		if (selectedValueOverride && selectedValue !== selectedValueOverride)
			setSelectedValue(selectedValueOverride);
	}, [selectedValueOverride]);

	useEffect(() => {
		console.log("Radio select:");
		console.log(disabled);
	}, [disabled]);

	return (
		<S.RadioContainer>
			{options.map((option) => (
				<S.RadioLabel
					key={option.value}
					selected={selectedValue === option.value}
					disabled={disabled}
				>
					<S.RadioInput
						type="radio"
						value={option.value}
						checked={selectedValue === option.value}
						onChange={() => handleOptionChange(option.value)}
						disabled={disabled}
					/>
					{option.label}
					{option.text}
				</S.RadioLabel>
			))}
		</S.RadioContainer>
	);
};

export default RadioSelect;
