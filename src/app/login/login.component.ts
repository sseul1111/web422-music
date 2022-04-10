import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import User from '../User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = { userName: '', password: '', _id: '' };
  warning: string = '';
  loading: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.user.userName == '') {
      this.loading = false;
      this.warning = 'Username must not be empty';
    } else if (this.user.password == '') {
      this.loading = false;
      this.warning = 'Password must not be empty';
    } else {
      this.loading = true;
      this.auth.login(this.user).subscribe(
        (msg) => {
          this.loading = false;
          localStorage.setItem('access_token', msg.token);
          this.router.navigate(['/newReleases']);
        },
        (err) => {
          this.loading = false;
          this.warning = err.error.message;
        }
      );
    }
  }

}

