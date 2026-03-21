import { Injectable, signal } from '@angular/core';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  category: string;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private _services = signal<ServiceItem[]>([ 
    { id: 's1', title: 'Home Deep Cleaning', description: '4-6 hours, 2-3 person team', priceFrom: 799, category: 'cleaning', image: '/images/Worker1.jpg' },
    { id: 's2', title: 'AC Repair (Split/Window)', description: 'Diagnosis and repair', priceFrom: 999, category: 'ac', image: '/images/Electrician.jpg' },
    { id: 's3', title: 'Washing Machine Repair', description: 'Top/bottom load', priceFrom: 699, category: 'electronics', image: '/images/worker2.jpg' },
    { id: 's4', title: 'Plumbing (Fix Leakage)', description: 'Minor plumbing work', priceFrom: 399, category: 'plumbing', image: '/images/Plumber.jpg' }
  ]);

  readonly services = this._services.asReadonly();

  getService(id: string) {
    return this._services().find(s => s.id === id) as ServiceItem | undefined;
  }
}
