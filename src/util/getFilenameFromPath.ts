const getFilenameFromPath = (str: string | undefined | null): string => {
    if (str && str.split('\\') && str.split('\\').pop()) {
        const splitByBackslash = str.split('\\').pop();
        if (splitByBackslash) {
            const splitByForwardSlash = splitByBackslash.split('/').pop();
            if (splitByForwardSlash) {
                return splitByForwardSlash;
            }
        }
    }
    return "";
}


export default getFilenameFromPath;