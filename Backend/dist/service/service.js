"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Service {
    constructor(repository) {
        this.repository = repository;
    }
    async register(email, password) {
        try {
            const data = {
                email: email,
                password: password
            };
            return await this.repository.create(data);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map