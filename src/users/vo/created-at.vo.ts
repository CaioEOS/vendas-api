export class CreatedAt {
  private readonly createdAt: Date;

  constructor(createdAt: Date) {
    if (!(createdAt instanceof Date)) {
      throw new Error('Invalid date format');
    }
    this.createdAt = createdAt;
  }

  get value(): Date {
    return this.createdAt;
  }
}
