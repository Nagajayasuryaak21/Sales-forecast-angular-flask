import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userId: string|null=null;

  constructor() { 
    this.getData();
  }

  getData() {
    const data = localStorage.getItem('userId');
    if (data) {
      this.userId = JSON.parse(data);
    }
  }

  setData(data: any) {
    this.userId = data;
    localStorage.setItem('userId', JSON.stringify(data));
  }
}
