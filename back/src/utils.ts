export function isNotDefined(str: string): boolean {
    return !str;
}

export function containsSpaces(str: string): boolean {
    return str.includes(' ');
}

export function isNegativeNumber(num: number): boolean {
    return num < 0;
}
