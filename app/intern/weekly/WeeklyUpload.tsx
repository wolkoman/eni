import {useState} from "../../(shared)/use-state-util";
import PDFMerger from "pdf-merger-js/browser";
import {toast} from "react-toastify";
import {uploadWeekly} from "./uploadWeekly";
import {EniLoading} from "../../../components/Loading";

export function WeeklyUpload() {

    const [uploadPossible, setUploadPossible] = useState<'idle' | 'loading' | 'success'>('idle');

    async function onUploadFile(file: File) {
        setUploadPossible('loading');
        const files = new FormData();
        const splittingSuccess = await Promise.all([['1', '2'], ['1', '3'], ['1', '4']].map(async (pages, i) => {
            const merger = new PDFMerger();
            await merger.add(file, pages)
            await merger.setMetadata({
                producer: "eni.wien - Wochenmitteilungen Generator",
                title: "Wochenmitteilungen"
            });
            files.append("WM" + i + ".pdf", await merger.saveAsBlob(), "WM" + i + ".pdf")
            return true;
        })).catch(() => {
            toast.error("Die Datei muss ein PDF mit vier Seiten sein.")
            setUploadPossible('idle');
        })
        if (!splittingSuccess) return;

        const uploadedFiles: string[] = await fetch('https://api.eni.wien/files-v0/upload.php', {
            method: 'POST',
            body: files,
        })
            .then(res => res.json())
            .then(data => data.map((file: string) => `https://api.eni.wien/files-v0/uploads/${file}`))
            .catch(() => setUploadPossible('idle'));

        if (!uploadedFiles) return;
        const date = new Date().toISOString().split("T")[0];
        uploadWeekly(date, uploadedFiles.find(file => file.includes("WM0"))!, uploadedFiles.find(file => file.includes("WM1"))!, uploadedFiles.find(file => file.includes("WM2"))!)
            .then(() => setUploadPossible('success'));
    }

    return <>
        <div className="text-3xl font-bold my-4 mt-10">Hochladen</div>
        {uploadPossible === 'idle' && <div>
            <div className="my-4">
                Laden Sie hier das fertiggestellte 4-seitige PDF der aktuellen Wochenmitteilungen hoch.
                Danach sind die Wochenmitteilungen auf der Website online.
            </div>
            <input type="file" onChange={e => e.target.files?.[0] ? onUploadFile(e.target.files[0]) : null}/>
        </div>}

        {uploadPossible === 'loading' && <EniLoading/>}
        {uploadPossible === 'success' && <div> Der Upload war erfolgreich! </div>}
    </>;
}
