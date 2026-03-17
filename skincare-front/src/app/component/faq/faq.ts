// src/app/component/faq/faq.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FaqService } from '../../service/faq';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule ,ReactiveFormsModule, HttpClientModule , RouterModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class FaqComponent {
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
 
   constructor(private contactService: FaqService) {}
 
   onSubmit(form: any) {
     if (form.invalid) return;
 
     this.isLoading = true;
     this.contactService.saveContact(this.contactData).subscribe({
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