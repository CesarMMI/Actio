import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/project-detail.component').then((m) => m.ProjectDetailComponent),
  },
];
