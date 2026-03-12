import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../service/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {

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

  constructor(private contactService: ContactService) {}

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