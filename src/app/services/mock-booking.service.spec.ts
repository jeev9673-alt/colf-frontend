import { TestBed } from '@angular/core/testing';
import { MockBookingService } from './mock-booking.service';

describe('MockBookingService', () => {
  let svc: MockBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MockBookingService] });
    svc = TestBed.inject(MockBookingService);
    // clear storage
    localStorage.removeItem('colf:bookings');
  });

  it('should start with empty bookings', () => {
    expect(svc.listBookings().length).toBe(0);
  });

  it('should create a booking and mark slot unavailable', async () => {
    const payload = { serviceId: 's1', date: '2026-03-21', time: '10:00', name: 'Alice', phone: '123' };
    const booked = await svc.book(payload);
    expect(booked.id).toBeTruthy();
    expect(svc.listBookings().length).toBe(1);
    expect(svc.isAvailable('s1', '2026-03-21', '10:00')).toBeFalse();
  });

  it('should mock pay and then cancel', async () => {
    const payload = { serviceId: 's2', date: '2026-03-22', time: '11:00', name: 'Bob' };
    const b = await svc.book(payload);
    const paid = await svc.mockPay(b.id);
    expect(paid.paid).toBeTrue();
    svc.cancel(b.id);
    expect(svc.getBooking(b.id)).toBeNull();
  });
});
import { TestBed } from '@angular/core/testing';
import { MockBookingService } from './mock-booking.service';

describe('MockBookingService', () => {
  let service: MockBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MockBookingService] });
    service = TestBed.inject(MockBookingService);
    localStorage.removeItem('colf:bookings');
  });

  it('books a slot and persists it', async () => {
    const b = await service.book({ serviceId: 's1', date: '2030-01-01', time: '09:00', name: 'Alice' });
    expect(b).toBeTruthy();
    expect(b.id).toBeDefined();
    const list = service.listBookings();
    expect(list.find(x => x.id === b.id)).toBeTruthy();
  });

  it('isAvailable returns false for duplicate slot', async () => {
    await service.book({ serviceId: 's2', date: '2030-01-02', time: '10:00', name: 'Bob' });
    expect(service.isAvailable('s2', '2030-01-02', '10:00')).toBeFalse();
  });

  it('mockPay marks booking paid', async () => {
    const b = await service.book({ serviceId: 's3', date: '2030-01-03', time: '11:00', name: 'C' });
    const paid = await service.mockPay(b.id);
    expect(paid.paid).toBeTrue();
    const got = service.getBooking(b.id);
    expect(got?.paid).toBeTrue();
  });

  it('cancel removes booking', async () => {
    const b = await service.book({ serviceId: 's4', date: '2030-01-04', time: '12:00', name: 'D' });
    service.cancel(b.id);
    expect(service.getBooking(b.id)).toBeNull();
  });
});
