import { Routes } from '@angular/router';
import { ShellComponent } from './shared/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      {
        path: 'inbox',
        loadChildren: () => import('./features/inbox/inbox.routes').then((m) => m.INBOX_ROUTES),
      },
      {
        path: 'actions',
        loadChildren: () => import('./features/actions/actions.routes').then((m) => m.ACTIONS_ROUTES),
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
      },
    ],
  },
];
