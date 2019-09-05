export class UserData {

  constructor(public username: string, public registerDate: number) {

  }

}

export class PasswordReset {

  constructor(public old_password: string, public new_password: string, public password_repeat: string) {

  }

}
