const shortenWord = (word: string, maxLength: number): string => {
    if (word.length <= maxLength) {
        return word;
    } else {
        return word.slice(0, maxLength - 3) + "...";
    }
};

export default shortenWord;