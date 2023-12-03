export type EnemyParams = {
    hp: number,
    speed: number,
    reward: number,
    takesHealth: number,
    scale: number,
    sprite: string,
    frame: string,
    canFly: boolean,
    flipX?: boolean,
    body: {
        width: number,
        height: number,
        radius: number,
        rotation: {
            right: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            },
            down: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            },
            up: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            },
            left: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            }
        }
    },
    animSet: {
        'walk-lr': string,
        'walk-up': string,
        'walk-down': string
    }
}