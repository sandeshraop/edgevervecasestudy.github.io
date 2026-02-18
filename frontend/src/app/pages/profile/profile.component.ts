import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public router: Router  // Made public for template access
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.http.get<any>('http://localhost:3000/api/auth/profile')
      .subscribe({
        next: (res) => {
          this.profileForm.patchValue(res);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load profile';
          this.loading = false;
        }
      });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const profileData = this.profileForm.getRawValue(); // Includes disabled fields

    this.http.put('http://localhost:3000/api/auth/profile', {
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address
    }).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }

  navigateToChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
