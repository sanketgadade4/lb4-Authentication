import { UserService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { User } from '../models';
import { Credentials, UserRepository } from '../repositories/user.repository';
import { BcryptHasher } from './hash.password';
export declare class MyUserService implements UserService<User, Credentials> {
    userRepository: UserRepository;
    hasher: BcryptHasher;
    constructor(userRepository: UserRepository, hasher: BcryptHasher);
    verifyCredentials(credentials: Credentials): Promise<User>;
    convertToUserProfile(user: User): UserProfile;
}
