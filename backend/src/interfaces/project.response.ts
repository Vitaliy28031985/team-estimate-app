import { Project } from 'src/mongo/schemas/project/project.schema';

export interface ProjectResponse {
  projects: Project[];
  total: number;
}
