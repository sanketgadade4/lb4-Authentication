"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const _ = tslib_1.__importStar(require("lodash"));
const keys_1 = require("../keys");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
const hash_password_1 = require("../services/hash.password");
const jwt_service_1 = require("../services/jwt-service");
const userjwt_service_1 = require("../services/userjwt.service");
const security_spec_1 = require("../utils/security-spec");
const user_credentials_repository_1 = require("../repositories/user-credentials.repository");
// this controller is for JWT authentication mechanism
let UserController = class UserController {
    constructor(userRepository, userCredentialsRepository, 
    // @inject('service.hasher')
    hasher, 
    // @inject('service.user.service')
    userService, 
    // @inject('service.jwt.service')
    jwtService) {
        this.userRepository = userRepository;
        this.userCredentialsRepository = userCredentialsRepository;
        this.hasher = hasher;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async signup(userData) {
        services_1.validateCredentials(_.pick(userData, ['email', 'password']));
        userData.password = await this.hasher.hashPassword(userData.password);
        const savedUser = await this.userRepository.create(_.omit(userData, 'password'));
        const usercred = {
            userId: userData.id,
            password: userData.password
        };
        console.log(userData);
        // const savedUser = await this.userRepository.create(userData);
        await this.userCredentialsRepository.create(usercred);
        delete savedUser.password;
        return savedUser;
    }
    async login(credentials) {
        console.log('test');
        // make sure user exist,password should be valid
        const user = await this.userService.verifyCredentials(credentials);
        // console.log(user);
        const userProfile = await this.userService.convertToUserProfile(user);
        // console.log(userProfile);
        const token = await this.jwtService.generateToken(userProfile);
        return Promise.resolve({ token: token });
    }
    //@authenticate('jwt')
    async me(currentUser) {
        console.log('jwt user controller');
        return Promise.resolve(currentUser);
    }
};
tslib_1.__decorate([
    rest_1.post('/signup', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    schema: rest_1.getJsonSchemaRef(models_1.User)
                }
            }
        }
    }),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.User]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
tslib_1.__decorate([
    rest_1.post('/jwt', {
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
], UserController.prototype, "login", null);
tslib_1.__decorate([
    rest_1.get('/me', {
        security: security_spec_1.OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'The current user profile',
                content: {
                    'application/json': {
                        schema: rest_1.getJsonSchemaRef(models_1.User),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, core_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
UserController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(user_credentials_repository_1.UserCredentialsRepository)),
    tslib_1.__param(2, core_1.inject(keys_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(3, core_1.inject(keys_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(4, core_1.inject(keys_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        user_credentials_repository_1.UserCredentialsRepository,
        hash_password_1.BcryptHasher,
        userjwt_service_1.MyUserService,
        jwt_service_1.JWTService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map