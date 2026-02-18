import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.scss']
})
export class BookingComponent {

  bookingForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      reservationDate: ['', Validators.required],
      reservationTime: ['', Validators.required],
      numberOfPersons: ['', [Validators.required, Validators.min(1)]],
      specialRequest: ['']
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.bookingForm.invalid) {
      return;
    }

    console.log(this.bookingForm.value);
  }
}
