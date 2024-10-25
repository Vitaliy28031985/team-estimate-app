import { Request } from 'express';
import { User } from 'src/mongo/schemas/user/user.schema';

export interface RequestWithUser extends Request {
  user?: User;
}
