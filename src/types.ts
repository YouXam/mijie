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

export type KeysType = readonly string[] | true | false | undefined;

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
    ai: (inputs: AiInputs) => Promise<AiResponse>,
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

export type Plugin<T extends KeysType> = {
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
                include?: string[],
                exclude?: string[]
            },
            md?: string,
            content?: string
        },
        admin?: {
            main: string,
            include?: string[],
            exclude?: string[]
        }
    },
    captcha?: boolean,
    checker?: T extends string[] 
        ? (ans: CheckerAnswer<T>, ctx: Context) => boolean | Promise<boolean>
        : T extends true | undefined
        ? (ans: string, ctx: Context) => boolean | Promise<boolean>
        : T extends false ? undefined : never,
    points: number,
    manualScores?: boolean,
    inputs?: T extends undefined ? undefined : T extends string[] ? {
        [K in keyof T]: T[K] extends string ? { name: T[K], placeholder: string }: never
    } : boolean,
    server?: (serverInstance: Omit<PluginServer<T>, 'handle' | 'adminHandle'>) => any,
    serverInstance?: any,
    next?: Array<{
        pid: string,
        description?: string
    }>,
    record?: boolean,
    showPercent?: boolean,
    first?: boolean,
    gameover?: boolean,
    folder?: string,
    hints?: Array<{
        uid: string,
        content: string
    }>
    files?: Array<{
        filename: string,
        info?: string
    }>
}

type ExtractNames<T extends readonly { name: string }[]> = {
    [K in keyof T]: T[K] extends { name: infer N extends string } ? N : never
};

type AutoPlugin<H> = Plugin<H extends undefined ? undefined
    : H extends any[]
    ? ExtractNames<H>
    : H extends true
    ? true
    : false
>


export function createPlugin<
  const H extends readonly { name: string; placeholder: string }[] | true | false = true
>(
  plugin: Omit<AutoPlugin<H>, 'pid'> & {
    pid: string;
    inputs?: H;
  }
): AutoPlugin<H> {
  return plugin as any;
}
