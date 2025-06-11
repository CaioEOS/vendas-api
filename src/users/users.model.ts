import { CreatedAt } from './vo/created-at.vo';
import { Email } from './vo/email.vo';
import { Name } from './vo/name';
import { Password } from './vo/password.vo';
import { StatusType } from './status.interface';
import { UpdatedAt } from './vo/updated-at.vo';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';

export class User {
  id?: UUIDTypes;
  username: Name;
  password: Password;
  email: Email;
  status?: StatusType = StatusType.ACTIVE;
  createdAt?: CreatedAt;
  updatedAt?: UpdatedAt;

  constructor(user: User) {
    this.id = uuidv4();
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.createdAt = new CreatedAt(new Date());
    this.updatedAt = new UpdatedAt(new Date());
  }
}
