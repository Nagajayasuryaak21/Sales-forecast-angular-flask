import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserServiceService } from './user-service.service';
@Injectable({
  providedIn: 'root',
})

export class DragdropService {
  constructor(private http: HttpClient, private usr:UserServiceService) {}

  addFiles(images: File) {
    var arr: any[] = [];
    var formData = new FormData();
    arr.push(images);

    arr[0].forEach((item: any, i: any) => {
      formData.append('avatar', arr[0][i]);
    });

    formData.append('id',this.usr.userId||"123");
    const params = {
      id: this.usr.userId||"123"
    }
    return this.http
      .post('http://localhost:4000/api/create-user', formData,{
        params:params,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    console.log(errorMessage);
    alert(error.error.message+" \nTry again!!");
    window.location.reload();
    return throwError(() => {
      return errorMessage;
    });
  }
}
