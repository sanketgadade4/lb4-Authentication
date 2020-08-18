"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const bcryptjs_1 = require("bcryptjs");
const keys_1 = require("../keys");
class BcryptHasher {
    async comparePassword(provdedPass, storedPass) {
        const passwordMatches = await bcryptjs_1.compare(provdedPass, storedPass);
        return passwordMatches;
    }
    // round: number = 10;
    async hashPassword(password) {
        const salt = await bcryptjs_1.genSalt(this.rounds);
        return await bcryptjs_1.hash(password, salt);
    }
}
tslib_1.__decorate([
    core_1.inject(keys_1.PasswordHasherBindings.ROUNDS),
    tslib_1.__metadata("design:type", Number)
], BcryptHasher.prototype, "rounds", void 0);
exports.BcryptHasher = BcryptHasher;
//# sourceMappingURL=hash.password.js.map