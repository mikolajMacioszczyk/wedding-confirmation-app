export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
}

export interface User {
  username: string;
  role: string;
  token: string;
  expiresAt: Date;
}
