export interface UserPayload {
  sub: number;
  tokenId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
