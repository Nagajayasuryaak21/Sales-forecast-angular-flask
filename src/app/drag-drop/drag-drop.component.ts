import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { DragdropService } from '../drag-drop.service';
import { FileService } from '../file.service';
import { UserServiceService } from '../user-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute ,Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css'],
})
export class DragDropComponent implements OnInit {
  fileArr: any[] = [];
  imgArr: any[] = [];
  fileObj: any[] = [];
  form: FormGroup;
  periodType:string ="";
  periodNum:string ="";
  msg!: string;
  progress: any = 0;
  display:string ='flex';
  public edited = false;
  public edited2 = false;
  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public dragdropService: DragdropService,
    public fileService: FileService,
    private router: Router,
    private route: ActivatedRoute ,
    private user: UserServiceService,
    private http: HttpClient
  
  ) {
    this.form = this.fb.group({
      avatar: [null],
    });
    this.edited=true;
    if(this.user.userId!=null){
      if(this.fileService.fileId!=null){
        this.edited2=true;
      }
      
    }else{
      this.logOut();
    }
  }
  ngOnInit() {}

  logOut(){
    this.router.navigate([""]);
  }



  upload(e: any) {
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const file = e ;
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });  
    });
    console.log(e);
    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item);
    });
    this.form.patchValue({
      avatar: this.fileObj,
    });
    this.form.get('avatar')?.updateValueAndValidity();
    this.dragdropService
      .addFiles(this.form.value.avatar)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / (event.total||100)) * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('File uploaded successfully!', event.body);
            this.display='block';
            this.fileService.setfileId(this.user.userId);
            this.fileService.setfilePath(event.body.path);
            console.log(this.fileService.filePath);
            setTimeout(() => {
              this.progress = 0;
              this.fileArr = [];
              this.fileObj = [];
              this.msg = 'File uploaded successfully!';
            }, 30);
            alert("File Uploaded Successfully !!");
            //this.edited=false;
            this.edited2=true;
            //this.router.navigate(['/period']);

        }
      });
  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onSubmit_period(){
    
    const params = new HttpParams().set('type', this.periodType).set('period', this.periodNum).set('file', this.fileService.filePath||"").set('path', this.user.userId||"123");
    console.log(params);
    const formData = new FormData();
    formData.append('User',this.user.userId||"UserId");

    this.http.post('http://127.0.0.1:5000/api/mydata',formData, { params }).subscribe((response) => {
      console.log('Form submitted successfully');
      console.log('Server response:', response);
      if(response.hasOwnProperty('error')){
        alert("Your .csv file must have \"date\" & \"sales\" column \nTry again!!");
      }else{
        this.router.navigate(['/plot']);
      }
      
    }, (error) => {
      console.error('Failed to submit form:', error);
    });

  }
}
