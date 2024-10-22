import { Request } from 'express';
import { User } from 'src/database/models/user/user.schema';

export interface RequestWithUser extends Request {
  user?: User;
}
