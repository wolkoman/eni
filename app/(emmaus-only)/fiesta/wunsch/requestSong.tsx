"use server"
import {notifyAdmin} from "@/app/(shared)/Telegram";

export async function requestSong(form: { for: string; title: string }) {
    await notifyAdmin("Song Request: '"+form.title+"' "+form.for)
}