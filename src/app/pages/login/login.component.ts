import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private fb: FormBuilder, private logSer: LoginService, private router: Router) {

  }

  loginForm!: FormGroup;

  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({

      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    
    if (this.loginForm.valid) {
      
      this.logSer.ValidateUser(this.loginForm.value).subscribe({
        
        next: (res: any) => {
          console.log(res);

          sessionStorage.setItem('token', res.accessToken);
          sessionStorage.setItem('Refreshtoken', res.refreshToken);

          this.router.navigate(['/dashboard']);
        },

        error: (err: any) => {
          console.log(err);
        }

      });

    }

  }


}
