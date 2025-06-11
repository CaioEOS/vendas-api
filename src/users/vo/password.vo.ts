export class Password {
  constructor(private readonly password: string) {
    if (!this.isValidPassword(password)) {
      throw new Error('Invalid password format');
    }
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  get value(): string {
    return this.password;
  }
}
