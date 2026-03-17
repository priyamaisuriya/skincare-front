import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FaqService, Faq } from '../../service/faq';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class FaqComponent implements OnInit {
  // Contact form data
  contactData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  successMessage = '';
  errorMessage = '';
  isLoading = false;

  // FAQ data
  faqs: Faq[] = [];

  constructor(private faqService: FaqService) {}

  ngOnInit() {
    // Fetch FAQs from backend
    this.faqService.getFaqs().subscribe({
      next: (data: Faq[]) => this.faqs = data,
      error: (err) => console.error('Error fetching FAQs', err)
    });
  }

  // Submit contact form
  onSubmit(form: any) {
    if (form.invalid) return;

    this.isLoading = true;
    this.faqService.saveContact(this.contactData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = "Message Sent Successfully!";
        this.errorMessage = '';
        form.reset();
        this.contactData = { name: '', email: '', phone: '', subject: '', message: '' };
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = "Failed to send message. Please try again.";
        this.successMessage = '';
        console.log(err);
      }
    });
  }
}