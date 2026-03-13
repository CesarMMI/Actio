import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Project } from '../../../core/models/project.model';
import { CrudPaginationService } from '../../../shared/pagination/services/crud-pagination.service';
import { ProjectsRequest } from '../types/project-pagination.api';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends CrudPaginationService<Project, ProjectsRequest> {
  protected override readonly apiUrl = `${environment.apiUrl}/projects`;
  protected override readonly entityName = 'projects';
}
