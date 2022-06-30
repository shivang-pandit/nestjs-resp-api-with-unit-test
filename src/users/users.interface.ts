export interface UserResponse {
 message: string,
 payload: {
  id: string,
  first_name: string,
  last_name: string,
  user_name: string,
  email: string,
  active: boolean,  
 }
}

export interface UserLogin {
  message: string,
  payload: {
    token: string
  }
}

export interface UserParams {
  [key: string]: string
}