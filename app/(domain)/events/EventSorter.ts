export const getTimeOfEvent = (event: any) => new Date(event!.start?.date ?? event!.start?.dateTime!).getTime();
