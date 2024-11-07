import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserGet } from 'src/interfaces/userGet';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      return false;
    }
    const typedUser = user as unknown as UserGet;
    if (typedUser.role === 'customer') {
      return false;
    }
    return true;
  }
}
