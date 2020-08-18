/// <reference types="express" />
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
export declare class TestController {
    private req;
    constructor(req: Request);
    myProfile(user: UserProfile): object;
    myProfilewithoutAuth(): object;
}
