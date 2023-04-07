import { Component } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';

import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userId: string|null;

  constructor(private route: ActivatedRoute ,private user_service: UserServiceService , private router: Router ) {
    this.userId="";
    if(this.user_service.userId==null){
      this.router.navigate(['']);
    }else{
      this.userId=this.user_service.userId;
      this.router.navigate(['/drop-box']);
    }
  }

}
