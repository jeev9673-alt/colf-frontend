import { Injectable } from '@angular/core';

export interface Booking {
  id: string;
  serviceId: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:MM
  name: string;
  phone?: string;
  paid?: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class MockBookingService {
  private storageKey = 'colf:bookings';

  private _read(): Booking[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private _write(list: Booking[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  listBookings(): Booking[] {
    return this._read();
  }

  getBooking(id: string) {
    return this._read().find(b => b.id === id) || null;
  }

  // simple availability: disallow same service/date/time duplicate
  isAvailable(serviceId: string, date: string, time: string) {
    const list = this._read();
    return !list.some(b => b.serviceId === serviceId && b.date === date && b.time === time);
  }

  async book(payload: Omit<Booking, 'id' | 'createdAt' | 'paid'> & { paid?: boolean }) {
    const list = this._read();
    if (!this.isAvailable(payload.serviceId, payload.date, payload.time)) {
      throw new Error('Slot not available');
    }
    const id = Math.random().toString(36).slice(2, 9);
    const booking: Booking = {
      id,
      serviceId: payload.serviceId,
      date: payload.date,
      time: payload.time,
      name: payload.name,
      phone: payload.phone,
      paid: !!payload.paid,
      createdAt: new Date().toISOString(),
    };
    list.push(booking);
    this._write(list);
    // simulate async confirmation
    return new Promise<Booking>((res) => setTimeout(() => res(booking), 300));
  }

  cancel(id: string) {
    const list = this._read().filter(b => b.id !== id);
    this._write(list);
  }

  // mock payment: mark booking as paid
  async mockPay(id: string) {
    const list = this._read();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    // simulate payment processing delay
    await new Promise(res => setTimeout(res, 300));
    list[idx].paid = true;
    this._write(list);
    return list[idx];
  }
}
