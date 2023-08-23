import axios from 'axios';

export const fetchData = async (url: string, data?: object, method?: string) => {
    try {
        const response = await axios({
            method: method || "POST",
            url,
            data,
        });
        return response.data;
    } catch (error) {
        console.error(`Error ${method} data:`, error);
        throw error;
    }
};