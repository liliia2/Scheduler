import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SheduleComponent } from './modules/shedule/shedule.component';
import { SettingsComponent } from './modules/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/shedule',
    pathMatch: 'full'
  },
  {
    path: 'shedule',
    component: SheduleComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
