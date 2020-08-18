export interface PasswordHasher<T = string> {
    hashPassword(password: T): Promise<T>;
    comparePassword(provdedPass: T, storedPass: T): Promise<boolean>;
}
export declare class BcryptHasher implements PasswordHasher<string> {
    comparePassword(provdedPass: string, storedPass: string): Promise<boolean>;
    readonly rounds: number;
    hashPassword(password: string): Promise<string>;
}
