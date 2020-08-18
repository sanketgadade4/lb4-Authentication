"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
const authentication_1 = require("@loopback/authentication");
const security_1 = require("@loopback/security");
const HEADER_SCHEMA = {
    type: 'object',
    properties: {
        'Content-Type': { type: 'string' },
    },
    additionalProperties: true,
};
const PING_RESPONSE = {
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
const USER_PROFILE_RESPONSE = {
    description: 'Session user profile',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'sessionUserProfile',
                properties: {
                    user: { type: 'object' },
                },
            },
        },
    },
};
let TestController = class TestController {
    constructor(req) {
        this.req = req;
    }
    myProfile(user) {
        return {
            // user:'This is test Endpoint',
            user: user.profile,
            headers: Object.assign({}, this.req.headers),
        };
    }
    myProfilewithoutAuth() {
        return {
            user: 'This is test Endpoint',
        };
    }
};
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    rest_1.get('/mycustomprofile', {
        responses: USER_PROFILE_RESPONSE,
    }),
    tslib_1.__param(0, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], TestController.prototype, "myProfile", null);
tslib_1.__decorate([
    rest_1.get('/myProfilewithoutAuth', {
        responses: USER_PROFILE_RESPONSE,
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], TestController.prototype, "myProfilewithoutAuth", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__metadata("design:paramtypes", [Object])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map