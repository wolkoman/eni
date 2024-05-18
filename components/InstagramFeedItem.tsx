import {CalendarInfo} from "@/domain/events/CalendarInfo";

export interface InstagramFeedItem {
    id: string,
    media_type: 'CAROUSEL_ALBUM' | 'VIDEO' | 'IMAGE',
    media_url: string,
    title: string,
    permalink: string,
    timestamp: string,
    caption: string,
    text: string,
    calendar: CalendarInfo | null,
}