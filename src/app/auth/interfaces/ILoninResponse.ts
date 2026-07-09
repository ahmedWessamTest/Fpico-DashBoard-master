export interface loginErrorMessage {
  error: string;
}

export interface ILogInResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  message: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface IUserData {
  email: string;
  password: string;
}
