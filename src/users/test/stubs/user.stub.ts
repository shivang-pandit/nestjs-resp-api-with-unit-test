import { User } from "../../schemas/user.schema";

export const userStub = (): User => {
  return {
    first_name: `first_name`,
    last_name: `Shivang`,
    user_name: `shivang_pandit`,
    email: `shivang@example.com`,        
    password: 'testT@123',
    active: true,
    login_attempts: 0,
    login_attempts_date: Date()
  }
}