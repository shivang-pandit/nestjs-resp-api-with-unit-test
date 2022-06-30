import { userStub } from "../test/stubs/user.stub";
import { userLoginStub } from "../test/stubs/user_login.stub";

export const UsersService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(userStub()),
    verifyLogin: jest.fn().mockResolvedValue(userStub()),
    findByParams: jest.fn().mockResolvedValue(null),
    validatePassword: jest.fn().mockResolvedValue(userStub()),
    getJwtToken: jest.fn().mockResolvedValue(userLoginStub().token),
    findById: jest.fn().mockResolvedValue(userStub()),
    updateLoginAttempts: jest.fn().mockResolvedValue(userStub()),
})