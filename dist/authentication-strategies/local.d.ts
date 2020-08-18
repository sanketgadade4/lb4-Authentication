/// <reference types="express" />
import { AuthenticationStrategy } from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { Request, RedirectRoute } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { User } from '../models';
import { Strategy, IVerifyOptions } from 'passport-local';
import { UserRepository } from '../repositories';
export declare class LocalAuthStrategy implements AuthenticationStrategy {
    userRepository: UserRepository;
    name: string;
    passportstrategy: Strategy;
    strategy: StrategyAdapter<User>;
    /**
     * create a local passport strategy
     */
    constructor(userRepository: UserRepository);
    /**
     * authenticate a request
     * @param request
     */
    authenticate(request: Request): Promise<UserProfile | RedirectRoute>;
    /**
     * authenticate user with provided username and password
     *
     * @param username
     * @param password
     * @param done
     *
     * @returns User model
     */
    verify(username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void;
    /**
     * maps returned User model from verify function to UserProfile
     *
     * @param user
     */
    mapProfile(user: User): UserProfile;
}
