"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../keys");
const jwt_service_1 = require("../services/jwt-service");
class JWTStrategy {
    constructor() {
        this.name = 'jwt';
    }
    async authenticate(request) {
        const token = this.extractCredentials(request);
        const userProfile = await this.jwtService.verifyToken(token);
        return Promise.resolve(userProfile);
    }
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw new rest_1.HttpErrors.Unauthorized('Authorization is missing');
        }
        const authHeaderValue = request.headers.authorization;
        // authorization : Bearer xxxx.yyyy.zzzz
        if (!authHeaderValue.startsWith('Bearer')) {
            throw new rest_1.HttpErrors.Unauthorized('Authorization header is not type of Bearer');
        }
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header has too many part is must follow this patter 'Bearer xx.yy.zz`);
        }
        const token = parts[1];
        return token;
    }
}
tslib_1.__decorate([
    core_1.inject(keys_1.TokenServiceBindings.TOKEN_SERVICE),
    tslib_1.__metadata("design:type", jwt_service_1.JWTService)
], JWTStrategy.prototype, "jwtService", void 0);
exports.JWTStrategy = JWTStrategy;
//# sourceMappingURL=jwt-stratgies.js.map