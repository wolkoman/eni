export interface ReaderTask<T> {
    event: T;
    data: { role: 'reader1' | 'reader2', userId: string, status: string };
}
export type ReaderStatus = 'assigned' | 'informed';
export type ReaderInfo = { id: string, name: string, status: ReaderStatus };
export type ReaderData = { [eventId: string]: { liturgy: string, reader1: ReaderInfo, reader2: ReaderInfo }}

export function getTasksFromReaderData<T>(readerData: ReaderData, eventMapper: (eventId: string) => T): ReaderTask<T>[] {
    return Object.entries(readerData)
        .map(([eventId, data]) => ({event: eventMapper(eventId), data}))
        .flatMap(({event, data}) => [
            {
                event,
                data: {role: 'reader1', userId: data?.reader1?.id, status: data?.reader1?.status}
            },
            {
                event,
                data: {role: 'reader2', userId: data?.reader2?.id, status: data?.reader2?.status}
            },
        ]);
}

export const getTasksForPerson = <T>(tasks: ReaderTask<T>[], id: string): ReaderTask<T>[] => tasks.filter(({data}) => data.userId === id);

export function getUninformedTasks<T>(tasks: ReaderTask<T>[]) {
    return tasks.filter(job => job.data.status === "assigned");
}