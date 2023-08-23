import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
    colors: {
        "primary-light": "#383838",
        primary: "#1E1E1E",
        "primary-neutral": "#222222",
        secondary: "#DADADA",
        "secondary-neutral": "#BABABA",
        "secondary-dark": "#A3A3A3",
        "accent-light": "#AE8DEF",
        accent: "#7D6CE2",
        "accent-dark": "#4C229F",
        error: "#e57373",
        "error-accent": "#fb464c",
        warning: "#f8c555",
        success: "#7ec699",
    },
    fontSizes: {
        tiny: "0.85rem",
        small: "1rem",
        medium: "1.5rem",
        large: "2rem",
        xlarge: "3rem",
    },
    fontWeights: {
        thin: 100,
        normal: 400,
        bold: 700,
    },
    spacing: {
        tiny: "2px",
        smallish: "4px",
        small: "8px",
        medium: "16px",
        large: "24px",
        xlarge: "48px",
        xxlarge: "64px",
    },
    breakpoints: {
        tablet: "968px",
        mobile: "450px",
    }
}

export default theme;