import {
  Request,
  RestBindings,
  get,
  RequestBodyObject,
  SchemaObject,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
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


export class TestController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @authenticate('jwt')
  @get('/mycustomprofile',
   {
    responses: USER_PROFILE_RESPONSE,
  }
  )
  myProfile(
    @inject(SecurityBindings.USER) user: UserProfile
    ): object {
   
    return {
      // user:'This is test Endpoint',
      user: user.profile,
      headers: Object.assign({}, this.req.headers),
    };
  }

    @get('/myProfilewithoutAuth',
    {
     responses: USER_PROFILE_RESPONSE,
   }
   )
   myProfilewithoutAuth(
     
     ): object {
     
     return {
        user:'This is test Endpoint',
      
     };
   }
}
