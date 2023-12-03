import { flatten, partition } from 'lodash';
import { CanDie } from '../objects/GameObject';

export interface List<T> {
    forEach: (callback: () => void) => void
    map: (callback: (v: T) => T, i: number, arr: T[]) => T[]
    reduce: <S>(callback: (acc: S, x: T) => S, acc: S) => S
}

export class AutoRemoveList<T extends CanDie> implements List<T> {
    public list: T[];

    constructor (...es) {
        this.list = flatten(es);
    }

    [Symbol.iterator] = function* (this) {
        yield* this.list;
    };

    add (...es) {
        this.list = flatten([ ...es, ...this.list ]);
    }

    forEach (callback) {
        return this.list.forEach(callback);
    }

    map (callback: (v: T, i: number, arr: T[]) => T) {
        return this.list.map(callback);
    }

    reduce<S> (callback: (acc: S, x: T) => S, acc: S) {
        return this.list.reduce(callback, acc);
    }

    update (time: number, delta: number) {
        this.list.forEach(function (e) { return e.update(time, delta); });
        
        const [ dead, alive ] = partition(this.list, function (e) { return e.isDead(); });

        dead.forEach(function (e) { return e.destroy(); });
        
        this.list = alive;
    }

    remove (e: T) {
        this.list = this.list.filter(function (x) { return x !== e; });
    }

    get active () {
        return this.list.filter(function (e) { return !e.isDead(); }).length;
    }
}
