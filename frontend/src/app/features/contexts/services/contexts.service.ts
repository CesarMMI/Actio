import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Context } from '../../../core/models/context.model';
import { CrudPaginationService } from '../../../shared/pagination/services/crud-pagination.service';
import { ContextsRequest } from '../types/contexts.api';

@Injectable({ providedIn: 'root' })
export class ContextsService extends CrudPaginationService<Context, ContextsRequest> {
  protected override readonly apiUrl = `${environment.apiUrl}/contexts`;
  protected override readonly entityName = 'contexts';
}
