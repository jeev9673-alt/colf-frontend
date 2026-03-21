import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookingComponent } from './booking.component';
import { MockDataService } from '../services/mock-data.service';
import { MockBookingService } from '../services/mock-booking.service';
import { FormsModule } from '@angular/forms';

describe('BookingComponent (payment flow)', () => {
  let fixture: any;
  let component: BookingComponent;
  let bookingSvc: MockBookingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingComponent, FormsModule],
      providers: [MockDataService, MockBookingService]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    bookingSvc = TestBed.inject(MockBookingService);
    localStorage.removeItem('colf:bookings');
  });

  it('creates a booking and completes payment', fakeAsync(async () => {
    component.model = { serviceId: 's1', date: '2030-02-01', time: '09:00', name: 'Test', phone: '999' };
    // spy on service methods
    spyOn(bookingSvc, 'book').and.callThrough();
    spyOn(bookingSvc, 'mockPay').and.callThrough();

    // prepare booking (creates pendingPayment)
    component.prepareBooking();
    tick(400); // wait for async book
    expect(bookingSvc.book).toHaveBeenCalled();
    expect(component.pendingPayment).toBeTruthy();

    // pay now
    component.payNow();
    tick(400); // wait for mockPay
    expect(bookingSvc.mockPay).toHaveBeenCalled();
    expect(component.confirmation).toBeTruthy();
    expect(component.confirmation.paid).toBeTrue();
  }));
});
