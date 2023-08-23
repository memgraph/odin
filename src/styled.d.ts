import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            "primary-light": string;
            primary: string;
            "primary-neutral": string;
            secondary: string;
            "secondary-neutral": string;
            "secondary-dark": string;
            "accent-light": string;
            accent: string;
            "accent-dark": string;
            error: string;
            "error-accent": string;
            warning: string;
            success: string;
        };
        fontSizes: {
            tiny: string;
            small: string;
            medium: string;
            large: string;
            xlarge: string;
        };
        fontWeights: {
            thin: number;
            normal: number;
            bold: number;
        };
        spacing: {
            tiny: string;
            small: string;
            smallish: string;
            medium: string;
            large: string;
            xlarge: string;
            xxlarge: string;
        };
        breakpoints: {
            tablet: string;
            mobile: string;
        }
    }
}