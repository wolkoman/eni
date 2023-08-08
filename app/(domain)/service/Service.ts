export interface ReaderTask<T> {
    event: T;
    data: { role: ReaderRole, userId: string, status: string };
}

export type ReaderRole = 'reading1' | 'reading2' | 'communionMinister1' | 'communionMinister2';
export type ReaderStatus = 'assigned' | 'informed' | 'cancelled';
export type ReaderInfo = { id: string, name: string, status: ReaderStatus };
export type ReaderData = {
    [eventId: string]: { liturgy: string, cancelledBy?: string[] } & Record<ReaderRole, ReaderInfo>
}

export function getTasksFromReaderData<T>(readerData: ReaderData, eventMapper: (eventId: string) => T): ReaderTask<T>[] {
    return Object.entries(readerData)
        .map(([eventId, data]) => ({event: eventMapper(eventId), data}))
        .filter(({event}) => event)
        .flatMap(({
                      event,
                      data
                  }) => (<ReaderRole[]>['reading1', 'reading2', 'communionMinister1', "communionMinister2"]).map(role => ({
            event,
            data: {role, userId: data?.[role]?.id, status: data?.[role]?.status}
        })));
}

export const getTasksForPerson = <T>(tasks: ReaderTask<T>[], id: string): ReaderTask<T>[] => tasks.filter(({data}) => data.userId === id);

export function getUninformedTasks<T>(tasks: ReaderTask<T>[]) {
    return tasks.filter(job => job.data.status === "assigned");
}

export function roleToString(role: ReaderRole) {
    return {
        reading1: "1. Lesung",
        reading2: "2. Lesung",
        communionMinister1: "1. Kommunionhelfer:in",
        communionMinister2: "2. Kommunionhelfer:in",
    }[role];
}
