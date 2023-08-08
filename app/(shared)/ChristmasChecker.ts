export function isChristmas() {
    return new Date("2022-12-25T00:00:00+01:00").getTime() < new Date().getTime()
        && new Date("2022-12-26T00:00:00+01:00").getTime() > new Date().getTime();
}

export function isBeforeChristmas() {
    return new Date("2022-12-22T00:00:00+01:00").getTime() < new Date().getTime()
        && new Date("2022-12-25T12:00:00+01:00").getTime() > new Date().getTime();
}
