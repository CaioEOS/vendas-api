export class UpdatedAt {
  private readonly updatedAt: Date;

  constructor(updatedAt: Date) {
    if (!(updatedAt instanceof Date)) {
      throw new Error('Invalid date format');
    }
    this.updatedAt = updatedAt;
  }

  get value(): Date {
    return this.updatedAt;
  }
}
