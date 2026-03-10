import { Routes } from '@angular/router';

export const CONTEXTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/contexts.component').then((m) => m.ContextsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/context-detail.component').then((m) => m.ContextDetailComponent),
  },
];
