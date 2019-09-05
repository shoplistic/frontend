export class UserRegister {

  constructor(public username: string, public password: string, public password_repeat: string, public captcha: string) {

  }

}

export interface UserRegisterResponse {
  message: string;
}
