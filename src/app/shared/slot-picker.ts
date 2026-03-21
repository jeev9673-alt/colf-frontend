import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockBookingService } from '../services/mock-booking.service';

@Component({
  selector: 'slot-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="slot-picker">
    <div *ngIf="!date || !serviceId" class="note">Select service and date to view slots.</div>
    <div *ngIf="date && serviceId">
      <div class="slots">
        <button *ngFor="let s of slots"
          class="slot" [disabled]="!s.available" [class.selected]="s.time===selected"
          (click)="selectSlot(s.time)">
          <div class="t">{{ s.time }}</div>
          <div class="st" *ngIf="!s.available">Booked</div>
        </button>
      </div>
      <div *ngIf="!slots.length" class="note">No slots available for selected date.</div>
    </div>
  </div>
  `,
  styles: [
    `:host{display:block}
    .note{color:var(--muted-2);padding:8px 0}
    .slots{display:flex;flex-wrap:wrap;gap:8px}
    .slot{padding:10px 12px;border-radius:8px;border:1px solid #eef0f2;background:white;min-width:96px;cursor:pointer}
    .slot[disabled]{opacity:0.5;cursor:not-allowed;background:#fbfbfb}
    .slot.selected{outline:2px solid var(--brand);transform:translateY(-2px)}
    .t{font-weight:600}
    .st{font-size:12px;color:#888}
    `
  ]
})
export class SlotPicker implements OnChanges {
  @Input() serviceId = '';
  @Input() date = ''; // yyyy-mm-dd
  @Input() selected = '';
  @Output() select = new EventEmitter<string>();

  slots: Array<{ time: string; available: boolean }> = [];

  constructor(private booking: MockBookingService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] || changes['serviceId']) this._buildSlots();
  }

  private _buildSlots() {
    this.slots = [];
    if (!this.date || !this.serviceId) return;
    // generate hourly slots from 09:00 to 17:00
    for (let h = 9; h < 17; h++) {
      const time = (h < 10 ? '0' + h : '' + h) + ':00';
      const available = this.booking.isAvailable(this.serviceId, this.date, time);
      this.slots.push({ time, available });
    }
  }

  selectSlot(t: string) {
    if (!t) return;
    const ok = this.slots.find(s => s.time === t)?.available;
    if (!ok) return;
    this.selected = t;
    this.select.emit(t);
  }
}
