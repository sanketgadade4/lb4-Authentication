/// <reference types="express" />
import { Response } from '@loopback/rest';
import { UserRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
import { UserCredentialsRepository } from '../repositories/user-credentials.repository';
import { UserIdentityRepository } from '../repositories/user-identity.repository';
import { BcryptHasher } from '../services/hash.password';
import { MyUserService } from '../services/userjwt.service';
import { JWTService } from '../services/jwt-service';
export declare type Credentials = {
    email: string;
    password: string;
    name: string;
};
export declare class UserLoginController {
    userRepository: UserRepository;
    userCredentialsRepository: UserCredentialsRepository;
    userIdentityRepository: UserIdentityRepository;
    hasher: BcryptHasher;
    userService: MyUserService;
    jwtService: JWTService;
    constructor(userRepository: UserRepository, userCredentialsRepository: UserCredentialsRepository, userIdentityRepository: UserIdentityRepository, hasher: BcryptHasher, userService: MyUserService, jwtService: JWTService);
    signup(credentials: Credentials, response: Response): Promise<Response<any>>;
    login(credentials: Credentials): Promise<{
        token: string;
    }>;
    /**
     * TODO: enable roles and authorization, add admin role authorization to this endpoint
     */
    clear(): Promise<void>;
    getExternalProfiles(profile: UserProfile): Promise<import("../models").UserIdentity[] | undefined>;
}
