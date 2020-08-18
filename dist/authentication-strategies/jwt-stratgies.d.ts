import { AuthenticationStrategy } from '@loopback/authentication';
import { RedirectRoute } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { JWTService } from '../services/jwt-service';
export declare class JWTStrategy implements AuthenticationStrategy {
    name: string;
    jwtService: JWTService;
    authenticate(request: Request<ParamsDictionary, any, any, ParsedQs>): Promise<UserProfile | RedirectRoute | undefined>;
    extractCredentials(request: Request<ParamsDictionary, any, any, ParsedQs>): string;
}
