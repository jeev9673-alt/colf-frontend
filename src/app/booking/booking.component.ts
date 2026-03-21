import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../services/mock-data.service';
import { MockBookingService } from '../services/mock-booking.service';
import { SlotPicker } from '../shared/slot-picker';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, SlotPicker],
  template: `
  <section class="booking container">
    <h2>Booking</h2>
    <p>Select a service and pick a preferred date/time (mocked).</p>
    <div class="form">
      <label>Service</label>
      <select [(ngModel)]="model.serviceId">
        <option value="" disabled>Select service</option>
        <option *ngFor="let s of data.services()" [value]="s.id">{{ s.title }}</option>
      </select>

      <label>Date</label>
      <input type="date" [(ngModel)]="model.date" />

      <label>Time</label>
      <slot-picker [serviceId]="model.serviceId" [date]="model.date" [selected]="model.time" (select)="model.time = $event"></slot-picker>
      <div *ngIf="model.time" class="selected-time">Selected: <strong>{{ model.time }}</strong></div>

      <label>Your name</label>
      <input type="text" [(ngModel)]="model.name" placeholder="Full name" />

      <label>Phone</label>
      <input type="tel" [(ngModel)]="model.phone" placeholder="Mobile number" />

      <div class="actions">
        <button class="btn" (click)="prepareBooking()" [disabled]="loading">Review & Pay</button>
        <span *ngIf="loading">Processing…</span>
      </div>

      <!-- Payment confirmation UI -->
      <div *ngIf="pendingPayment" class="payment" [attr.shake]="paymentFailed ? '' : null">
        <h3>Payment</h3>
        <p>Service: <strong>{{ serviceTitle(pendingPayment.serviceId) }}</strong></p>
        <p>When: <strong>{{ pendingPayment.date }} {{ pendingPayment.time }}</strong></p>
        <p>Amount: <strong>₹499</strong> <!-- mocked fixed amount --></p>
        <div class="pay-actions">
          <button class="btn" (click)="payNow()" [disabled]="paying">Pay Now</button>
          <button class="btn ghost" (click)="cancelPending()" [disabled]="paying">Cancel</button>
          <span *ngIf="paying">Processing payment…</span>
        </div>
      </div>

      <div *ngIf="confirmation" class="confirm" [class.paid]="confirmation.paid" [class.unpaid]="!confirmation.paid">
        <h3>Booking confirmed</h3>
        <p>Booking ID: <strong>{{ confirmation.id }}</strong></p>
        <p>{{ confirmation.date }} at {{ confirmation.time }} — {{ serviceTitle(confirmation.serviceId) }}</p>
        <p>Status: <strong>{{ confirmation.paid ? 'Paid' : 'Pending payment' }}</strong></p>

        <div *ngIf="confirmation.paid" class="receipt">
          <h4>Receipt</h4>
          <p>Amount paid: <strong>₹499</strong></p>
          <p>Paid on: {{ confirmation.createdAt | date:'medium' }}</p>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [
    `:host{display:block} .container{max-width:700px;margin:0 auto;padding:16px} .form{display:flex;flex-direction:column;gap:12px} select,input{padding:10px;border:1px solid #e6e6e6;border-radius:8px} label{font-weight:600;color:var(--muted-2)} .btn{background:var(--success);color:#fff;padding:10px 14px;border-radius:10px;border:none;align-self:flex-start} .confirm{background:#f7fff9;border:1px solid #e6fff0;padding:12px;border-radius:8px;margin-top:12px}
      .confirm.paid{animation:fadeUp 360ms ease both}
      .receipt{margin-top:12px;padding:10px;border-radius:8px;background:#fff;box-shadow:0 8px 24px rgba(15,23,42,0.06)}
      .payment{margin-top:12px;padding:12px;border-radius:8px;border:1px solid #eef0f2;background:#fff}
      .btn.ghost{background:transparent;color:var(--muted-2);border:1px solid #eef0f2;margin-left:8px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      .payment[shake] { animation: shake 520ms; }
      @keyframes shake{ 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
    `]
})
export class BookingComponent {
  model = { serviceId: '', date: '', time: '', name: '', phone: '' };
  loading = false;
  confirmation: any = null;
  pendingPayment: any = null; // holds booking awaiting payment
  paying = false;
  paymentFailed = false;

  constructor(public data: MockDataService, private booking: MockBookingService) {}

  serviceTitle(id: string) {
    const s = this.data.services().find((x: any) => x.id === id);
    return s ? s.title : '';
  }

  async confirm() {
    if (!this.model.serviceId || !this.model.date || !this.model.time || !this.model.name) {
      alert('Please complete the form');
      return;
    }
    this.loading = true;
    try {
      const result = await this.booking.book({
        serviceId: this.model.serviceId,
        date: this.model.date,
        time: this.model.time,
        name: this.model.name,
        phone: this.model.phone,
      });
      // instead of immediately finalizing payment, set pendingPayment for user to pay
      this.pendingPayment = result;
      // clear selection fields so user picks fresh next time
      this.model.serviceId = '';
      this.model.date = '';
      this.model.time = '';
    } catch (err: any) {
      alert(err?.message || 'Unable to book slot');
    } finally {
      this.loading = false;
    }
  }

  // renamed helper to prepare booking (keeps backward compatibility)
  async prepareBooking() {
    return this.confirm();
  }

  async payNow() {
    if (!this.pendingPayment) return;
    this.paying = true;
    try {
      const paid = await this.booking.mockPay(this.pendingPayment.id);
      this.confirmation = paid;
      this.pendingPayment = null;
      // small success cue: could be enhanced with animations
      // the template shows receipt when paid
    } catch (e) {
      alert('Payment failed');
      // apply temporary failure cue on pendingPayment (shake)
      if (this.pendingPayment) {
        this.paymentFailed = true;
        setTimeout(() => { this.paymentFailed = false; }, 600);
      }
    } finally {
      this.paying = false;
    }
  }

  cancelPending() {
    if (!this.pendingPayment) return;
    // cancel reservation
    this.booking.cancel(this.pendingPayment.id);
    this.pendingPayment = null;
  }
}
