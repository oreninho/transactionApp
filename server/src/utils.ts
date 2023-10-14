function toCamelCase(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase());
}
export function mapTransactionFields<T>(source: any): T {
    const target: any = {};

    for (const key in source) {
        if (source.hasOwnProperty(key) && source[key]) {
            const camelCaseKey = toCamelCase(key);
            target[camelCaseKey] = source[key];
        }
    }

    return target as T;
}
