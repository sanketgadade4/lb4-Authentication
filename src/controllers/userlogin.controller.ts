// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {
  post,
  del,
  requestBody,
  Response,
  RestBindings,
  RequestWithSession,
  get,
} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {UserCredentialsRepository} from '../repositories/user-credentials.repository';
import {UserIdentityRepository} from '../repositories/user-identity.repository';
import { BcryptHasher } from '../services/hash.password';
import { PasswordHasherBindings, UserServiceBindings, TokenServiceBindings } from '../keys';
import { MyUserService } from '../services/userjwt.service';
import { JWTService } from '../services/jwt-service';

export type Credentials = {
  email: string;
  password: string;
  name: string;
};

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
export class UserLoginController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(UserIdentityRepository)
    public userIdentityRepository: UserIdentityRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    // @inject('service.user.service')
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    // @inject('service.jwt.service')
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    
  ) {}

  @post('/signup')
  async signup(
    @requestBody({
      description: 'signup user locally',
      required: true,
      content: {
        'application/x-www-form-urlencoded': {schema: CredentialsSchema},
      },
    })
    credentials: Credentials,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    let userCredentials;
    try {
      userCredentials = await this.userCredentialsRepository.findById(
        credentials.email,
      );
    } catch (err) {
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
    } else {
      /**
       * The express app that routed the /signup call to LB App, will handle the error event.
       */
      response.emit(
        'User Exists',
        credentials.email + ' is already registered',
      );
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

  @post('/login', {
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
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    
    // make sure user exist,password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    // console.log(user);
    const userProfile = await this.userService.convertToUserProfile(user);
    // console.log(userProfile);

    const token = await this.jwtService.generateToken(userProfile);
    console.log('Congratulations! use this token for jwt auth :'+token);
    return Promise.resolve({token: token})
  }


  /**
   * TODO: enable roles and authorization, add admin role authorization to this endpoint
   */
  @authenticate('basic')
  @del('/clear')
  async clear() {
    await this.userCredentialsRepository.deleteAll();
    await this.userIdentityRepository.deleteAll();
    await this.userRepository.deleteAll();
  }

  @authenticate('jwt')
  @get('/profiles')
  async getExternalProfiles(
    @inject(SecurityBindings.USER) profile: UserProfile,
  ) {
    const user = await this.userRepository.findById(
      parseInt(profile[securityId]),
      {
        include: [
          {
            relation: 'profiles',
          },
        ],
      },
    );
    console.log('this is test profile with jwt auth');
    return user.profiles;
  }
}
