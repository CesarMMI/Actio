import { Routes } from '@angular/router';
import { ContextsComponent } from './contexts.component';
import { ContextDetailComponent } from './context-detail.component';

export const CONTEXTS_ROUTES: Routes = [
  { path: '', component: ContextsComponent },
  { path: ':id', component: ContextDetailComponent },
];
