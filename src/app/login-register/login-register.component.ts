import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent implements OnInit {
  username: string;
  password: string;
  email: string;
  data: any;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private user_service: UserServiceService
  ) {
    this.username = '';
    this.password = '';
    this.email = '';
    localStorage.clear();
    
  }
  ngOnInit() {}
  onclick1() {
    const elem = this.el.nativeElement.querySelector('.container');
    this.renderer.addClass(elem, 'sign-up-mode');
    console.log('click' + ' ' + this.username + ' ' + this.password);
  }
  onclick2() {
    const elem = this.el.nativeElement.querySelector('.container');
    this.renderer.removeClass(elem, 'sign-up-mode');
    console.log('click');
  }
  clear() {
    this.username = '';
    this.password = '';
    this.email = '';
  }
  onSubmit_log() {
    if(this.username=="" || this.password=="" ){
      alert("Enter all the fields");
    }else{
    this.http
      .post<any>('http://localhost:4000/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe(
        (res) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          alert(res.message);
          this.user_service.setData(res.id);
          this.router.navigate(['/log']);
          this.clear();
        },
        (err) => {
          console.log(err.error.message);
          alert(err.error.message);
          this.clear();
        }
      );
    }
  }
  onSubmit_reg() {
    if(this.username=="" || this.password=="" || this.email==""){
      alert("Enter all the fields"+this.username);
    }else{
      this.http
      .post<any>('http://localhost:4000/register', {
        username: this.username,
        password: this.password,
        email: this.email,
      })
      .subscribe(
        (res) => {
          console.log(res);
          alert(res.message);
          this.onclick2();
          this.clear();
        },
        (err) => {
          console.log(err.error.message);
          alert(err.message);
          console.error(err);
          this.clear();
        }
      );
    }
  }
}
