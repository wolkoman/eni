export enum SiteType {
    ENI, EMMAUS
}

export const siteType = process.env.NEXT_PUBLIC_SITE === 'eni' ? SiteType.ENI : SiteType.EMMAUS;

export function site<T>(eni: T, emmaus: T): T {
    const record: Record<SiteType, T> = {
        [SiteType.ENI]: eni,
        [SiteType.EMMAUS]: emmaus
    }
    return record[siteType];
}
