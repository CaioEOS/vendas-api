export class Name {
  private readonly name: string;

  constructor(name: string) {
    if (!this.isValidName(name)) {
      throw new Error('Invalid name format');
    }
    this.name = name;
  }

  private isValidName(name: string): boolean {
    return name.length >= 3 && /^[a-zA-Z\s]+$/.test(name);
  }

  get value(): string {
    return this.name;
  }
}
