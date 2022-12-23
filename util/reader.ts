export interface ReaderTask<T> {
    event: T;
    data: { role: ReaderRole, userId: string, status: string };
}

export type ReaderRole = 'reading1' | 'reading2';
export type ReaderStatus = 'assigned' | 'informed' | 'cancelled';
export type ReaderInfo = { id: string, name: string, status: ReaderStatus };
export type ReaderData = { [eventId: string]: { liturgy: string, reading1: ReaderInfo, reading2: ReaderInfo, cancelledBy?: string[] }}

export function getTasksFromReaderData<T>(readerData: ReaderData, eventMapper: (eventId: string) => T): ReaderTask<T>[] {
    return Object.entries(readerData)
        .map(([eventId, data]) => ({event: eventMapper(eventId), data}))
        .filter(({event}) => event)
        .flatMap(({event, data}) => [
            {
                event,
                data: {role: 'reading1', userId: data?.reading1?.id, status: data?.reading1?.status}
            },
            {
                event,
                data: {role: 'reading2', userId: data?.reading2?.id, status: data?.reading2?.status}
            },
        ]);
}

export const getTasksForPerson = <T>(tasks: ReaderTask<T>[], id: string): ReaderTask<T>[] => tasks.filter(({data}) => data.userId === id);

export function getUninformedTasks<T>(tasks: ReaderTask<T>[]) {
    return tasks.filter(job => job.data.status === "assigned");
}
