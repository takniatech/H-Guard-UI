export interface LoginResponse {
  token:string,
  user:any,
  message:string,
  store:any | null
}
export interface LoginRequest {
  email:string,
  password:string
}