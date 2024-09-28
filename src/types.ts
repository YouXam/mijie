export interface GameConfig {
    endTime?: string;
    startTime?: string;
    gamerule?: string;
    gameover?: string;
    about?: string;
}

export type Plugin = {
    pid: string,
    name: string,
    description: {
        before_solve: {
            mdv?: {
                main: string,
                include: string[],
                exclude: string[]
            },
            md?: string,
            content?: string
        },
        after_solve: {
            mdv?: {
                main: string,
                include: string[],
                exclude: string[]
            },
            md?: string,
            content?: string
        }
    },
    checker: string | ((ans: string, ctx: any) => boolean),
    points: number,
    manualScores: boolean,
    inputs: boolean,
    server?: (serverInstance: any) => any,
    serverInstance?: any,
    next?: Array<{
        pid: string,
        name: string
    }>,
    first?: boolean,
    gameover?: boolean,
    folder: string,
    hints?: Array<{
        uid: string,
        content: string
    }>
    files?: Array<{
        filename: string,
        info: string
    }>
}
