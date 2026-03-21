import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockBookingService, Booking } from '../services/mock-booking.service';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="dashboard container">
    <h2>Dashboard</h2>
    <p>Recent bookings and quick actions.</p>

    <div class="bookings">
      <table class="table">
        <thead><tr><th>When</th><th>Service</th><th>Customer</th><th>Phone</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let b of bookings">
            <td>{{ b.date }} {{ b.time }}</td>
            <td>{{ serviceTitle(b.serviceId) }}</td>
            <td>{{ b.name }}</td>
            <td>{{ b.phone || '—' }}</td>
            <td>{{ b.paid ? 'Paid' : 'Pending' }}</td>
            <td>
              <button *ngIf="!b.paid" class="btn" (click)="pay(b)">Pay</button>
              <button class="btn ghost" (click)="cancel(b)">Cancel</button>
            </td>
          </tr>
          <tr *ngIf="bookings.length===0"><td colspan="6">No bookings yet.</td></tr>
        </tbody>
      </table>
    </div>
  </section>
  `,
  styles: [
    `:host{display:block} .container{max-width:1100px;margin:0 auto;padding:16px} .table{width:100%;border-collapse:collapse} .table th,.table td{padding:10px;border-bottom:1px solid #f1f3f5;text-align:left} .btn{background:var(--brand);color:#fff;padding:6px 10px;border-radius:8px;border:0} .btn.ghost{background:transparent;color:var(--muted-2);border:1px solid #eef0f2}`
  ]
})
export class DashboardComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: MockBookingService, private dataService: MockDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.bookings = this.bookingService.listBookings().sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
  }

  serviceTitle(id: string) {
    const s = this.dataService.services().find((x: any) => x.id === id);
    return s ? s.title : 'Service';
  }

  async pay(b: Booking) {
    try {
      await this.bookingService.mockPay(b.id);
      this.load();
    } catch (e) {
      alert('Payment failed');
    }
  }

  cancel(b: Booking) {
    if (!confirm('Cancel booking?')) return;
    this.bookingService.cancel(b.id);
    this.load();
  }
}
