import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth';
import { HttpClient } from '@angular/common/http';
import { StateService } from '../../service/state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  passwordForm: FormGroup;
  states = signal<any[]>([]);
  
  message = signal<string | null>(null);
  error = signal<string | null>(null);
  
  pwdMessage = signal<string | null>(null);
  pwdError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private stateService: StateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const user = this.authService.currentUser();
    
    this.profileForm = this.fb.group({
      name: [user?.name || '', Validators.required],
      first_name: [user?.first_name || ''],
      last_name: [user?.last_name || ''],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone_number: [user?.phone_number || ''],
      address: [user?.address || ''],
      city: [user?.city || ''],
      state: [user?.state || ''],
      postal_code: [user?.postal_code || '']
    });

    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/account']);
        return;
      }
    }
    this.loadStates();
  }

  loadStates() {
    this.stateService.getStates().subscribe({
      next: (res: any) => this.states.set(res.data || []),
      error: (err) => console.error('Failed to load states', err)
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('new_password')?.value === g.get('new_password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  updateProfile() {
    this.message.set(null);
    this.error.set(null);
    
    this.http.post('http://127.0.0.1:8000/api/front/profile', this.profileForm.value).subscribe({
      next: (res: any) => {
        this.message.set('Profile updated successfully!');
        // Update local user data
        localStorage.setItem('user', JSON.stringify(res.data));
        this.authService.currentUser.set(res.data);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Update failed');
      }
    });
  }

  changePassword() {
    this.pwdMessage.set(null);
    this.pwdError.set(null);

    if (this.passwordForm.invalid) return;

    this.http.post('http://127.0.0.1:8000/api/front/profile/change-password', this.passwordForm.value).subscribe({
      next: (res: any) => {
        this.pwdMessage.set('Password changed successfully!');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.pwdError.set(err.error?.message || 'Password change failed');
      }
    });
  }

}
