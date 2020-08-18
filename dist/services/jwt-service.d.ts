import { UserProfile } from '@loopback/security';
export declare class JWTService {
    readonly jwtSecret: string;
    readonly expiresSecret: string;
    generateToken(userProfile: UserProfile): Promise<string>;
    verifyToken(token: string): Promise<UserProfile>;
}
