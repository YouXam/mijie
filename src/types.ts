import type { runCode, glot } from './games/glot';
import type jwt from 'jsonwebtoken';
import type { GameStorage, GameProcess } from './gameprocess';
import { PluginServer } from './pluginServer';
import { AiInputs, AiResponse } from './ai';

export interface GameConfig {
    endTime?: string;
    startTime?: string;
    gamerule?: string;
    gameover?: string;
    about?: string;
}

type InputItem = { name: string; placeholder: string };
export type KeysType = string[] | boolean;

type CheckerAnswer<T extends KeysType> = T extends false
  ? never
  : T extends true
  ? string
  : T extends string[]
  ? { [K in T[number]]: string }
  : never;

export type Context = {
    glot: typeof glot,
    runCode: typeof runCode,
    username: string,
    gameProcess: InstanceType<typeof GameProcess>,
    gameStorage: Awaited<ReturnType<InstanceType<typeof GameStorage>['game']>>,
    jwt: typeof jwt,
    ai: (inputs: AiInputs) => AiResponse,
    msg: (str: string) => void,
    content: (str: string) => void
}

export type ServerContext = {
    glot: typeof glot,
    runCode: typeof runCode,
    username: string,
    gameProcess: InstanceType<typeof GameProcess>,
    gameStorage: Awaited<ReturnType<InstanceType<typeof GameStorage>['game']>>,
    jwt: typeof jwt,
    ai: (inputs: any) => any,
    pass: (str?: string) => void,
    nopass: (str?: string) => void
}

export type Plugin<T extends KeysType, E = never> = {
    pid: string,
    name: string,
    description: {
        before_solve: {
            mdv?: {
                main: string,
                include?: string[],
                exclude?: string[]
            },
            md?: string,
            content?: string
        },
        after_solve?: {
            mdv?: {
                main: string,
                include: string[],
                exclude: string[]
            },
            md?: string,
            content?: string
        }
    },
    checker?: T extends string[] 
        ? (ans: CheckerAnswer<T>, ctx: Context) => boolean | Promise<boolean>
        : T extends true
        ? (ans: string, ctx: Context) => boolean | Promise<boolean>
        : never,
    points: number,
    manualScores?: boolean,
    inputs?: T extends string[] ? {
        [K in keyof T]: T[K] extends string ? { name: T[K] } & { placeholder: string }: never
    } : false,
    server?: (serverInstance: PluginServer<T>) => any,
    serverInstance?: any,
    next?: Array<{
        pid: string,
        description?: string
    }>,
    first?: boolean,
    gameover?: boolean,
    folder?: string,
    hints?: Array<{
        uid: string,
        content: string
    }>
    files?: Array<{
        filename: string,
        info: string
    }>
}
