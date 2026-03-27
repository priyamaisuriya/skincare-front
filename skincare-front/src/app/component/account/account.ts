import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
       ? null : {'mismatch': true};
  }

  onLogin() {
    this.errorMessage.set(null);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login Response:', res);
          this.successMessage.set('Login successful!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Login failed');
        }
      });
    }
  }

  onRegister() {
    this.errorMessage.set(null);
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.successMessage.set('Registration successful!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.error?.errors) {
            const firstErr = Object.values(err.error.errors)[0] as string[];
            this.errorMessage.set(firstErr[0]);
          } else {
            this.errorMessage.set(err.error?.message || 'Registration failed');
          }
        }
      });
    }
  }
}
