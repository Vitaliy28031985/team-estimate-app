import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGet } from 'src/interfaces/userGet';
import { Project } from 'src/mongo/schemas/project/project.schema';

@Injectable()
export class ProjectDeleteGuard implements CanActivate {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.params.projectId;

    const user = request.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      return false;
    }
    const typedUser = user as unknown as UserGet;
    if (typedUser.role === 'customer') {
      return false;
    }

    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (project.owner.toString() === typedUser._id.toString()) {
      return true;
    }

    return false;
  }
}