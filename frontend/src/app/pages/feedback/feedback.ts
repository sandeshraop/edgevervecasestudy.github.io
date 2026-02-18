import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbackComponent {

  feedbackForm: FormGroup;

  stars = [1, 2, 3, 4, 5];
  emojis = [
    { value: 1, icon: '😡' },
    { value: 2, icon: '🙁' },
    { value: 3, icon: '😐' },
    { value: 4, icon: '🙂' },
    { value: 5, icon: '😄' }
  ];
  recommendationScale = [0,1,2,3,4,5];

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      ratingFood: [null, Validators.required],
      ratingService: [null, Validators.required],
      recommendation: [null, Validators.required],
      comment: ['']
    });
  }

  selectFoodRating(value: number) {
    this.feedbackForm.patchValue({ ratingFood: value });
  }

  selectServiceRating(value: number) {
    this.feedbackForm.patchValue({ ratingService: value });
  }

  selectRecommendation(value: number) {
    this.feedbackForm.patchValue({ recommendation: value });
  }

  onSubmit() {
    if (this.feedbackForm.invalid) return;
    console.log(this.feedbackForm.value);
  }
}
