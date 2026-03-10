import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tasks.component').then((m) => m.TasksComponent),
  },
];
