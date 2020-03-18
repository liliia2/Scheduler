import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomDateAdapter } from './modules/shedule/custom-date-adapter';
import { DayComponent } from './modules/shedule/day/day.component';
import { HeaderComponent } from './modules/header/header.component';
import { MonthComponent } from './modules/shedule/month/month.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { SheduleComponent } from './modules/shedule/shedule.component';
import { TaskModalComponent } from './modals/task-modal/task-modal.component';
import { TaskInfoModalComponent } from './modals/task-info/task-info-modal.component';
import { WeekComponent } from './modules/shedule/week/week.component';

import { SettingsEffects } from './store/effects/settings.effects';
import { TasksEffects } from './store/effects/tasks.effects';
import { UsersEffects } from './store/effects/users.effects';
import { settingsReducers } from '../app/store/reducers/settings.reducers';
import { tasksReducers } from '../app/store/reducers/tasks.reducers';
import { usersReducers } from './store/reducers/users.reducers';

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    HeaderComponent,
    MonthComponent,
    SettingsComponent,
    SheduleComponent,
    TaskModalComponent,
    TaskInfoModalComponent,
    WeekComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    StoreModule.forRoot({
      settings: settingsReducers,
      tasks: tasksReducers,
      users: usersReducers
    }),
    EffectsModule.forRoot([
      SettingsEffects,
      TasksEffects,
      UsersEffects
    ])
  ],
  exports: [],
  entryComponents: [ TaskModalComponent, TaskInfoModalComponent ],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    },
    {
      provide: TaskModalComponent, useClass: TaskModalComponent
    },
    {
      provide: TaskInfoModalComponent, useClass: TaskInfoModalComponent
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
