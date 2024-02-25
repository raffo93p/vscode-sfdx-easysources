export function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

export function isNotBlank(str) {
    return !isBlank(str);
}