import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileId: string|null=null;
  filePath: string|null=null;
  fileName: string|null=null;

  constructor() {
    this.getData();
   }

   getData() {
    const fileId = localStorage.getItem('fileId');
    if (fileId) {
      this.fileId = JSON.parse(fileId);
    }
    const filePath = localStorage.getItem('filePath');
    if (filePath) {
      this.filePath = JSON.parse(filePath);
    }
    const fileName = localStorage.getItem('fileId');
    if (fileName) {
      this.fileName = JSON.parse(fileName);
    }
  }

  setfileId(data: any) {
    this.fileId = data;
    localStorage.setItem('fileId', JSON.stringify(data));
  }
  setfilePath(data: any) {
    this.filePath = data;
    localStorage.setItem('filePath', JSON.stringify(data));
  }
  setfileName(data: any) {
    this.fileName = data;
    localStorage.setItem('fileName', JSON.stringify(data));
  }
}
