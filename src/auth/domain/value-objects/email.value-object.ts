export class Email {
  private readonly email: string;

  constructor(email: string) {
    this.validate(email);
    this.email = email;
  }

  private validate(email: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public get value(): string {
    return this.email;
  }

  public static create(email: string): Email {
    return new Email(email);
  }
}
