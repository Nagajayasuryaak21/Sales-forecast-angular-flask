import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { PeriodComponent } from './period/period.component';
import {MyCComponent} from  './my-c/my-c.component'

const routes: Routes = [
  { path: 'log', component: LoginComponent },
  { path: 'drop-box', component: DragDropComponent },
  { path: 'period', component: PeriodComponent },
  { path: 'plot', component: MyCComponent },
  { path: '', component: LoginRegisterComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
