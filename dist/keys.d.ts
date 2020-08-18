import { TokenService, UserService, UserIdentityService } from '@loopback/authentication';
import { BindingKey } from '@loopback/core';
import { User } from './models';
import { Credentials } from './repositories/user.repository';
import { PasswordHasher } from './services/hash.password';
import { Profile as PassportProfile } from 'passport';
export declare namespace TokenServiceConstants {
    const TOKEN_SECRET_VALUE = "138asda8213";
    const TOKEN_EXPIRES_IN_VALUE = "7h";
}
export declare namespace TokenServiceBindings {
    const TOKEN_SECRET: BindingKey<string>;
    const TOKEN_EXPIRES_IN: BindingKey<string>;
    const TOKEN_SERVICE: BindingKey<TokenService>;
}
export declare namespace PasswordHasherBindings {
    const PASSWORD_HASHER: BindingKey<PasswordHasher<string>>;
    const ROUNDS: BindingKey<number>;
}
export declare namespace UserServiceBindings {
    const USER_SERVICE: BindingKey<UserService<Credentials, User>>;
    const PASSPORT_USER_IDENTITY_SERVICE: BindingKey<UserIdentityService<PassportProfile, User>>;
}
