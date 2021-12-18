export default function encodeQuery(data: Record<string, string>): string {
    return Object.keys(data).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    }).join('&');
}