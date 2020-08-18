// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Request,
  RestBindings,
  get,
  RequestBodyObject,
  SchemaObject,
  getJsonSchemaRef,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { User } from '../models';

const HEADER_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    'Content-Type': {type: 'string'},
  },
  additionalProperties: true,
};

const PING_RESPONSE: RequestBodyObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          headers: HEADER_SCHEMA,
        },
      },
    },
  },
};

const USER_PROFILE_RESPONSE: RequestBodyObject = {
  description: 'Session user profile',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'sessionUserProfile',
        properties: {
          user: {type: 'object'},
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/ping', {
    responses: PING_RESPONSE,
  })
  ping(): object {
    return {
        //user:'Test Response'
      headers: Object.assign({}, this.req.headers),
    };
  }

  //@authenticate('jwt')
  @authenticate('session')
  @get('/whoAmI',
   {
    responses: USER_PROFILE_RESPONSE,
  }
  )
  whoAmI(@inject(SecurityBindings.USER) user: UserProfile): object {
    /**
     * controller returns back currently logged in user information
     */
    console.log(user.profile);
    return {
      
      user: user.profile,
     // headers: Object.assign({}, this.req.headers),
    };
  }

  @authenticate("jwt")
  @get('/jwtwhoAmI', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);
  }
}
