"use server"
export async function loadScannedDocuments(): Promise<{ filename: string, last_modified: string, path:string }[]> {
  return await fetch("https://api.eni.wien/files-v0/scans.php", {
    method: 'GET',
    headers: {
      'X-Token': process.env.ENI_API_TOKEN!
    },
    next: {
      revalidate: 0
    }
  }).then(response => response.json())
}
