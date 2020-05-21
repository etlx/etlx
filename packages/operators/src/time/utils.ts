export const seconds = (x: number) => x * 1000
export const minutes = (x: number) => x * seconds(60)
export const hours = (x: number) => x * minutes(60)
export const days = (x: number) => x * hours(24)
