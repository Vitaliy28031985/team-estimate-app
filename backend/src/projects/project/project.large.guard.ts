import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserGet } from 'src/interfaces/userGet';
import { Project } from 'src/mongo/schemas/project/project.schema';

@Injectable()
export class ProjectLargeGuard implements CanActivate {
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

    const userProjectsArray: {
      id: string;
      userId: string;
      allowLevel: string;
      lookAt: string;
      lookAtTotals: string;
      _id: Types.ObjectId;
    }[] = typedUser.projectIds;

    const isEmptyProjectId = userProjectsArray.some(
      ({ id }) => id === projectId,
    );

    if (!isEmptyProjectId) {
      return false;
    }
    const currentProjectId = userProjectsArray.filter(
      ({ id }) => id === projectId,
    );

    if (currentProjectId[0].allowLevel === 'read') {
      return false;
    }

    if (currentProjectId[0].lookAt === 'small') {
      return false;
    }

    return true;
  }
}