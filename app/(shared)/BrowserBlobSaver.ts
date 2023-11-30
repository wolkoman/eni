export function saveFile(filename: string, blob: Blob) {
    const blobUrl = URL.createObjectURL(blob);
    let link: HTMLAnchorElement | null = document.createElement("a");
    link.download = filename;
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    link?.remove();
    window.URL.revokeObjectURL(blobUrl);
    link = null;
}
