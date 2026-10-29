export interface Result { code: number; stdout: string; stderr: string }
export function binaryPath(): string;
export function run(args: string[], options?: { stdin?: string; env?: Record<string, string | undefined> }): Promise<Result>;
export function status(): Promise<Result>;
export function connect(): Promise<Result>;
export function disconnect(): Promise<Result>;
export function login(account: string): Promise<Result>;
export function daemon(): import("bun").Subprocess;
