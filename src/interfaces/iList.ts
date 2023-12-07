export interface IList<T> {
    forEach: (callback: () => void) => void
    map: (callback: (v: T) => T, i: number, arr: T[]) => T[]
    reduce: <S>(callback: (acc: S, x: T) => S, acc: S) => S
}