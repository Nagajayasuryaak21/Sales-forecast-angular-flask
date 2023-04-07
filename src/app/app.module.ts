import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from  '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DragDropFileUploadDirective } from './drag-drop-file-upload.directive';
import { PeriodComponent } from './period/period.component';
import { ChildComponent } from './drag-drop/child/child.component';
import { MyCComponent } from './my-c/my-c.component';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    LoginComponent,
    DragDropFileUploadDirective,
    DragDropComponent,
    PeriodComponent,
    ChildComponent,
    CanvasJSChart,
    MyCComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
