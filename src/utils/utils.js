import moment from "moment";
import jwt_decode from "jwt-decode";

// Find item that matches value of an attribute
export function filterByAttribute(array, attr, value) {
    return array.filter(
        (obj) => obj.hasOwnProperty(attr) && obj[attr] === value
    );
}

// Get all keys of an object
export function getAllKeys(object) {
    return Object.keys(object);
}

export const fetchDocuments = (rows, id) => {
    return rows.find((row) => row.id === id);
};

export function getAllHeaderColumns(headCells) {
    let keys = [];
    headCells.forEach((header) => {
        keys.push(header.id);
    });
    return keys;
}

export const stringRegex = /^\w+( \w+)*$/;

export const host_url = "https://tch2202.onrender.com";

export const formatSecondsToDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:MM:SS");
};

export const convertSecondsToTime = (input) => {
    let seconds = input;
    let days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    let hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    let mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    return {
        days: days,
        hours: hrs,
        minutes: mnts,
        seconds: seconds,
    };
};

export function randomIntWithinRange(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const fromMilisecondsToDateString = (milisecondsSinceEpoch) => {
    return moment(milisecondsSinceEpoch).format("DD MMM YYYY HH:mm:ss");
};

export const fromMilisecondsToDisplayFormatDateString = (
    milisecondsSinceEpoch
) => {
    return moment(milisecondsSinceEpoch).format("DD MMM YYYY");
};

export const fromMilisecondsToDate = (milisecondsSinceEpoch) => {
    const date = new Date(milisecondsSinceEpoch * 1000);
    return date.toUTCString();
};

export function convertStringToArray(input) {
    if (input.startsWith("[")) {
        input = input.substring(1, input.length);
    }
    if (input.endsWith("]")) {
        input = input.substring(0, input.length - 1);
    }
    return input.split(",");
}

export function isExpired(secondsSinceEpoch) {
    return secondsSinceEpoch < Date.now() / 1000;
}

export function isExpiredToken(secondsSinceEpoch) {
    return secondsSinceEpoch < Date.now() / 1000;
}

export function objectToMap(obj) {
    return Object.keys(obj).map((key) => obj[key])
}

export function convertDateToDayOfTheWeek(date) {
    let day = moment(date, "DD MMM YYYY");
    return day.format("ddd");
}

export function getCurrentDateAsDBFormat() {
    return moment().format("YYYY/M/D");
}

export function decodeToken(token) {
    if (token) {
        return jwt_decode(token.substring(7, token.length));
    } else {
        return "-1";
    }
}

export function subtractTime(date_now, date_future) {
    let isNegative = false;
    let delta = date_future - date_now;
    if (delta < 0) {
        isNegative = true;
        delta = Math.abs(delta);
    }

    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;

    let str = "";
    str += days > 0 ? days + " days, " : "";
    str += hours > 0 ? hours + " hours, " : "";
    str += minutes + " minutes";
    return isNegative ? "Overdue for " + str : str;
}

export const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
};

export function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function getDayByNumber(number) {
    if (number > 6 || number < 0) {
        return -1;
    }
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[number];
}

export function downloadFile(url, filename) {
    console.log(url)
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch((error) => console.error("Error:", error));
}

export function normalizeIndex(index) {
    const limit = 5;
    return index > limit ? (index % (limit + 1)) + 1 : index;
}
