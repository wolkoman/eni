import {fetchJson} from "@/app/(shared)/FetchJson";

export function notifyAdmin(message: string) {
    console.warn("ADMIN ", message);
    return Promise.all(
        process.env.TELEGRAM_ADMIN_CHATIDS?.split(",").map(chatId =>
            fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${chatId}&text=${process.env.STAGE}: ${message}`)
                .catch(() => {
                    console.error("NOTIFY FAILED ", message);
                })
        ) ?? []
    );
}

export function notifyAdminFromClientSide(message: string) {
    return fetchJson("/api/notify", {json: {message}})
}
