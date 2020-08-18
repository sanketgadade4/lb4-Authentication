"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceBindings = exports.PasswordHasherBindings = exports.TokenServiceBindings = exports.TokenServiceConstants = void 0;
const core_1 = require("@loopback/core");
var TokenServiceConstants;
(function (TokenServiceConstants) {
    TokenServiceConstants.TOKEN_SECRET_VALUE = '138asda8213';
    TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE = '7h';
})(TokenServiceConstants = exports.TokenServiceConstants || (exports.TokenServiceConstants = {}));
var TokenServiceBindings;
(function (TokenServiceBindings) {
    TokenServiceBindings.TOKEN_SECRET = core_1.BindingKey.create('authentication.jwt.secret');
    TokenServiceBindings.TOKEN_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.expiresIn');
    TokenServiceBindings.TOKEN_SERVICE = core_1.BindingKey.create('services.jwt.service');
})(TokenServiceBindings = exports.TokenServiceBindings || (exports.TokenServiceBindings = {}));
var PasswordHasherBindings;
(function (PasswordHasherBindings) {
    PasswordHasherBindings.PASSWORD_HASHER = core_1.BindingKey.create('services.hasher');
    PasswordHasherBindings.ROUNDS = core_1.BindingKey.create('services.hasher.rounds');
})(PasswordHasherBindings = exports.PasswordHasherBindings || (exports.PasswordHasherBindings = {}));
var UserServiceBindings;
(function (UserServiceBindings) {
    UserServiceBindings.USER_SERVICE = core_1.BindingKey.create('services.user.service');
    UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE = core_1.BindingKey.create('services.passport.identity');
})(UserServiceBindings = exports.UserServiceBindings || (exports.UserServiceBindings = {}));
//# sourceMappingURL=keys.js.map