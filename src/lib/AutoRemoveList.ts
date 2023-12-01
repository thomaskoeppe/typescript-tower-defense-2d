import { flatten, partition } from 'lodash';
import { CanDie } from '../objects/GameObject';

export interface List<T> {
    forEach: (callback: () => void) => void
    map: (callback: (v: T) => T, i: number, arr: T[]) => T[]
    reduce: <S>(callback: (acc: S, x: T) => S, acc: S) => S
}

export default class AutoRemoveList<T extends CanDie> implements List<T> {
    public list: T[]

    constructor(...es) {
        this.list = flatten(es)
    }

    [Symbol.iterator] = function* (this) {
        yield* this.list
    }

    add(...es) {
        this.list = flatten([...es, ...this.list])
        return this
    }

    forEach(callback) {
        return this.list.forEach(callback)
    }

    map(callback: (v: T, i: number, arr: T[]) => T) {
        return this.list.map(callback)
    }

    reduce<S>(callback: (acc: S, x: T) => S, acc: S) {
        return this.list.reduce(callback, acc)
    }

    update(time: number, delta: number) {
        this.list.forEach(e => e.update(time, delta))
        
        const [dead, alive] = partition(this.list, e => e.isDead())

        dead.forEach(e => e.destroy())
        
        this.list = alive
    }

    remove(e: T) {
        this.list = this.list.filter(x => x !== e)
    }

    get active() {
        return this.list.filter(e => !e.isDead()).length
    }
}