"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2LoginApplication = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const sequence_1 = require("./sequence");
const authentication_1 = require("@loopback/authentication");
const authentication_strategies_1 = require("./authentication-strategies");
const authentication_strategy_providers_1 = require("./authentication-strategy-providers");
const authentication_interceptors_1 = require("./authentication-interceptors");
const services_1 = require("./services");
const core_1 = require("@loopback/core");
const rest_crud_1 = require("@loopback/rest-crud");
const passport_1 = tslib_1.__importDefault(require("passport"));
const path_1 = tslib_1.__importDefault(require("path"));
const jwt_stratgies_1 = require("./authentication-strategies/jwt-stratgies");
const rest_explorer_1 = require("@loopback/rest-explorer");
const keys_1 = require("./keys");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const jwt_service_1 = require("./services/jwt-service");
const userjwt_service_1 = require("./services/userjwt.service");
const hash_password_1 = require("./services/hash.password");
class OAuth2LoginApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        this.setUpBindings();
        // this.addSecuritySpec();
        this.OAUTH_PROVIDERS_LOCATION = '../oauth2-providers.json';
        this.component(authentication_1.AuthenticationComponent);
        authentication_1.registerAuthenticationStrategy(this, jwt_stratgies_1.JWTStrategy);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_crud_1.CrudRestComponent);
        this.component(rest_explorer_1.RestExplorerComponent);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passport_1.default.serializeUser(function (user, done) {
            done(null, user);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passport_1.default.deserializeUser(function (user, done) {
            done(null, user);
        });
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
    setUpBindings() {
        this.bind(keys_1.UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(services_1.PassportUserIdentityService);
        // passport strategies
        this.add(core_1.createBindingFromClass(authentication_strategy_providers_1.FacebookOauth, { key: 'facebookStrategy' }));
        this.add(core_1.createBindingFromClass(authentication_strategy_providers_1.GoogleOauth, { key: 'googleStrategy' }));
        this.add(core_1.createBindingFromClass(authentication_strategy_providers_1.CustomOauth2, { key: 'oauth2Strategy' }));
        // passport express middleware
        this.add(core_1.createBindingFromClass(authentication_strategy_providers_1.FacebookOauth2ExpressMiddleware, {
            key: 'facebookStrategyMiddleware',
        }));
        this.add(core_1.createBindingFromClass(authentication_strategy_providers_1.GoogleOauth2ExpressMiddleware, {
            key: 'googleStrategyMiddleware',
        }));
        this.add(core_1.createBindingFromClass(authentication_strategy_providers_1.CustomOauth2ExpressMiddleware, {
            key: 'oauth2StrategyMiddleware',
        }));
        // LoopBack 4 style authentication strategies
        this.add(core_1.createBindingFromClass(authentication_strategies_1.LocalAuthStrategy));
        this.add(core_1.createBindingFromClass(authentication_strategies_1.FaceBookOauth2Authorization));
        this.add(core_1.createBindingFromClass(authentication_strategies_1.GoogleOauth2Authorization));
        this.add(core_1.createBindingFromClass(authentication_strategies_1.Oauth2AuthStrategy));
        this.add(core_1.createBindingFromClass(authentication_strategies_1.SessionStrategy));
        this.add(core_1.createBindingFromClass(authentication_strategies_1.BasicStrategy));
        // Express style middleware interceptors
        this.bind('passport-init-mw').to(rest_1.toInterceptor(passport_1.default.initialize()));
        this.bind('passport-session-mw').to(rest_1.toInterceptor(passport_1.default.session()));
        this.bind('passport-facebook').toProvider(authentication_interceptors_1.FacebookOauthInterceptor);
        this.bind('passport-google').toProvider(authentication_interceptors_1.GoogleOauthInterceptor);
        this.bind('passport-oauth2').toProvider(authentication_interceptors_1.CustomOauth2Interceptor);
        this.bind('set-session-user').toProvider(authentication_interceptors_1.SessionAuth);
        this.bind(keys_1.PasswordHasherBindings.PASSWORD_HASHER).toClass(hash_password_1.BcryptHasher);
        this.bind(keys_1.PasswordHasherBindings.ROUNDS).to(10);
        this.bind(keys_1.UserServiceBindings.USER_SERVICE).toClass(userjwt_service_1.MyUserService);
        this.bind(keys_1.TokenServiceBindings.TOKEN_SERVICE).toClass(jwt_service_1.JWTService);
        this.bind(keys_1.TokenServiceBindings.TOKEN_SECRET).to(keys_1.TokenServiceConstants.TOKEN_SECRET_VALUE);
        this.bind(keys_1.TokenServiceBindings.TOKEN_EXPIRES_IN).to(keys_1.TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
    }
    addSecuritySpec() {
        this.api({
            openapi: '3.0.0',
            info: {
                title: 'test application',
                version: '1.0.0',
            },
            paths: {},
            components: { securitySchemes: authentication_jwt_1.SECURITY_SCHEME_SPEC },
            security: [
                {
                    // secure all endpoints with 'jwt'
                    jwt: [],
                },
            ],
            servers: [{ url: '/' }],
        });
    }
}
exports.OAuth2LoginApplication = OAuth2LoginApplication;
//# sourceMappingURL=application.js.map