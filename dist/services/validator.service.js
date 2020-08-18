"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentials = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const isEmail = tslib_1.__importStar(require("isemail"));
function validateCredentials(credentials) {
    if (!isEmail.validate(credentials.email)) {
        throw new rest_1.HttpErrors.UnprocessableEntity('invalid Email');
    }
    if (credentials.password.length < 8) {
        throw new rest_1.HttpErrors.UnprocessableEntity('password length should be greater than 8');
    }
}
exports.validateCredentials = validateCredentials;
//# sourceMappingURL=validator.service.js.map