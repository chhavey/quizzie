
function formatDate(inputDate) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
        "en-US",
        options
    );
    return formattedDate;
}

const formatNum = (num) => {
    if (num === 0) {
        return '0';
    } else if (num < 10) {
        return `0${num}`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    } else {
        return num;
    }
};

export { formatDate, formatNum };