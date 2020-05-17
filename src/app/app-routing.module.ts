import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleComponent } from './modules/schedule/schedule.component';
import { SettingsComponent } from './modules/settings/settings.component';

import { ExitSettingsGuard } from './modules/settings/exit-settings.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/schedule',
    pathMatch: 'full'
  },
  {
    path: 'schedule',
    component: ScheduleComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canDeactivate: [ExitSettingsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ExitSettingsGuard]
})
export class AppRoutingModule { }
