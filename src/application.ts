// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, toInterceptor} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {MySequence} from './sequence';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {
  FaceBookOauth2Authorization,
  GoogleOauth2Authorization,
  Oauth2AuthStrategy,
  LocalAuthStrategy,
  SessionStrategy,
  BasicStrategy,
} from './authentication-strategies';
import {
  FacebookOauth,
  GoogleOauth,
  CustomOauth2,
  FacebookOauth2ExpressMiddleware,
  GoogleOauth2ExpressMiddleware,
  CustomOauth2ExpressMiddleware,
} from './authentication-strategy-providers';
import {
  SessionAuth,
  FacebookOauthInterceptor,
  GoogleOauthInterceptor,
  CustomOauth2Interceptor,
} from './authentication-interceptors';
import {PassportUserIdentityService} from './services';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CrudRestComponent} from '@loopback/rest-crud';
import passport from 'passport';
import path from 'path';
import { JWTStrategy } from './authentication-strategies/jwt-stratgies';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants,
   UserServiceBindings
  } 
   from './keys';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import { JWTService } from './services/jwt-service';
import { MyUserService } from './services/userjwt.service';
import { BcryptHasher } from './services/hash.password';


export class OAuth2LoginApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  OAUTH_PROVIDERS_LOCATION: string;
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setUpBindings();
   // this.addSecuritySpec();
     this.OAUTH_PROVIDERS_LOCATION='../oauth2-providers.json';
     this.component(AuthenticationComponent);
     registerAuthenticationStrategy(this, JWTStrategy)

    // Set up the custom sequence
    this.sequence(MySequence);
      // Set up default home page
      this.static('/', path.join(__dirname, '../public'));

      // Customize @loopback/rest-explorer configuration here
      this.configure(RestExplorerBindings.COMPONENT).to({
        path: '/explorer',
      });
    
    this.component(CrudRestComponent);
    this.component(RestExplorerComponent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.serializeUser(function (user: any, done) {
      done(null, user);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.deserializeUser(function (user: any, done) {
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

  setUpBindings(): void {
    this.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
      PassportUserIdentityService,
    );
    // passport strategies
    this.add(createBindingFromClass(FacebookOauth, {key: 'facebookStrategy'}));
    this.add(createBindingFromClass(GoogleOauth, {key: 'googleStrategy'}));
    this.add(createBindingFromClass(CustomOauth2, {key: 'oauth2Strategy'}));
    // passport express middleware
    this.add(
      createBindingFromClass(FacebookOauth2ExpressMiddleware, {
        key: 'facebookStrategyMiddleware',
      }),
    );
    this.add(
      createBindingFromClass(GoogleOauth2ExpressMiddleware, {
        key: 'googleStrategyMiddleware',
      }),
    );
    this.add(
      createBindingFromClass(CustomOauth2ExpressMiddleware, {
        key: 'oauth2StrategyMiddleware',
      }),
    );
    // LoopBack 4 style authentication strategies
    this.add(createBindingFromClass(LocalAuthStrategy));
    this.add(createBindingFromClass(FaceBookOauth2Authorization));
    this.add(createBindingFromClass(GoogleOauth2Authorization));
    this.add(createBindingFromClass(Oauth2AuthStrategy));
    this.add(createBindingFromClass(SessionStrategy));
    this.add(createBindingFromClass(BasicStrategy));
    // Express style middleware interceptors
    this.bind('passport-init-mw').to(toInterceptor(passport.initialize()));
    this.bind('passport-session-mw').to(toInterceptor(passport.session()));
    this.bind('passport-facebook').toProvider(FacebookOauthInterceptor);
    this.bind('passport-google').toProvider(GoogleOauthInterceptor);
    this.bind('passport-oauth2').toProvider(CustomOauth2Interceptor);
    this.bind('set-session-user').toProvider(SessionAuth);

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10)
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
  }
  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'test application',
        version: '1.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}
