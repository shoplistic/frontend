export class UserLogin {

  constructor(public username: string, public password: string) {

  }

}

export interface UserLoginResponse {
  username: string;
  bearer: string;
  admin: boolean;
}
