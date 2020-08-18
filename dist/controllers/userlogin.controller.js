"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
const repository_1 = require("@loopback/repository");
const security_1 = require("@loopback/security");
const authentication_1 = require("@loopback/authentication");
const user_credentials_repository_1 = require("../repositories/user-credentials.repository");
const user_identity_repository_1 = require("../repositories/user-identity.repository");
const hash_password_1 = require("../services/hash.password");
const keys_1 = require("../keys");
const userjwt_service_1 = require("../services/userjwt.service");
const jwt_service_1 = require("../services/jwt-service");
const CredentialsSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 8,
        },
    },
};
// this controller for openId authentication .
let UserLoginController = class UserLoginController {
    constructor(userRepository, userCredentialsRepository, userIdentityRepository, 
    // @inject('service.hasher')
    hasher, 
    // @inject('service.user.service')
    userService, 
    // @inject('service.jwt.service')
    jwtService) {
        this.userRepository = userRepository;
        this.userCredentialsRepository = userCredentialsRepository;
        this.userIdentityRepository = userIdentityRepository;
        this.hasher = hasher;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async signup(credentials, response) {
        let userCredentials;
        try {
            userCredentials = await this.userCredentialsRepository.findById(credentials.email);
        }
        catch (err) {
            if (err.code !== 'ENTITY_NOT_FOUND') {
                throw err;
            }
        }
        if (!userCredentials) {
            const user = await this.userRepository.create({
                email: credentials.email,
                username: credentials.email,
                name: credentials.name,
            });
            userCredentials = await this.userCredentialsRepository.create({
                id: credentials.email,
                password: credentials.password,
                userId: user.id,
            });
            response.redirect('/login');
            return response;
        }
        else {
            /**
             * The express app that routed the /signup call to LB App, will handle the error event.
             */
            response.emit('User Exists', credentials.email + ' is already registered');
            return response;
        }
    }
    //@authenticate('local')
    // @authenticate('basic')
    // @post('/login',{
    //   responses: {
    //     '200': {
    //       description: 'login success',
    //     },
    //   },
    // })
    // async login(
    //   @requestBody({
    //     description: 'login to create a user session',
    //     required: true,
    //     content: {
    //       'application/x-www-form-urlencoded': {schema: CredentialsSchema},
    //     },
    //   })
    //   credentials: Credentials,
    //   @inject(SecurityBindings.USER) user: UserProfile,
    //   @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
    //   @inject(RestBindings.Http.RESPONSE) response: Response,
    // ) {
    //   const profile = {
    //     ...user.profile,
    //   };
    // //  console.log('this is profile '+ profile);
    //   request.session.user = profile;
    //   response.redirect('/auth/account');
    //   return response;
    // }
    async login(credentials) {
        // make sure user exist,password should be valid
        const user = await this.userService.verifyCredentials(credentials);
        // console.log(user);
        const userProfile = await this.userService.convertToUserProfile(user);
        // console.log(userProfile);
        const token = await this.jwtService.generateToken(userProfile);
        console.log('Congratulations! use this token for jwt auth :' + token);
        return Promise.resolve({ token: token });
    }
    /**
     * TODO: enable roles and authorization, add admin role authorization to this endpoint
     */
    async clear() {
        await this.userCredentialsRepository.deleteAll();
        await this.userIdentityRepository.deleteAll();
        await this.userRepository.deleteAll();
    }
    async getExternalProfiles(profile) {
        const user = await this.userRepository.findById(parseInt(profile[security_1.securityId]), {
            include: [
                {
                    relation: 'profiles',
                },
            ],
        });
        console.log('this is test profile with jwt auth');
        return user.profiles;
    }
};
tslib_1.__decorate([
    rest_1.post('/signup'),
    tslib_1.__param(0, rest_1.requestBody({
        description: 'signup user locally',
        required: true,
        content: {
            'application/x-www-form-urlencoded': { schema: CredentialsSchema },
        },
    })),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserLoginController.prototype, "signup", null);
tslib_1.__decorate([
    rest_1.post('/login', {
        responses: {
            '200': {
                description: 'Token',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
    }),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserLoginController.prototype, "login", null);
tslib_1.__decorate([
    authentication_1.authenticate('basic'),
    rest_1.del('/clear'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserLoginController.prototype, "clear", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    rest_1.get('/profiles'),
    tslib_1.__param(0, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserLoginController.prototype, "getExternalProfiles", null);
UserLoginController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(user_credentials_repository_1.UserCredentialsRepository)),
    tslib_1.__param(2, repository_1.repository(user_identity_repository_1.UserIdentityRepository)),
    tslib_1.__param(3, core_1.inject(keys_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(4, core_1.inject(keys_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(5, core_1.inject(keys_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        user_credentials_repository_1.UserCredentialsRepository,
        user_identity_repository_1.UserIdentityRepository,
        hash_password_1.BcryptHasher,
        userjwt_service_1.MyUserService,
        jwt_service_1.JWTService])
], UserLoginController);
exports.UserLoginController = UserLoginController;
//# sourceMappingURL=userlogin.controller.js.map