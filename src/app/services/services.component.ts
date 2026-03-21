import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from './mock-data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="services container">
    <h2>Our Services</h2>
    <div class="grid">
      <article *ngFor="let s of data.services()" class="card">
        <picture>
          <source [attr.srcset]="s.image" type="image/jpeg">
          <img class="thumb" [src]="s.image" alt="{{s.title}}" loading="lazy" decoding="async" width="800" height="140" />
        </picture>
        <h3>{{ s.title }}</h3>
        <p>{{ s.description }}</p>
        <div class="meta">From ₹{{ s.priceFrom }}</div>
        <a class="btn" [routerLink]="['/booking']">Book</a>
      </article>
    </div>
  </section>
  `,
  styles: [
    `:host{display:block} .container{max-width:1100px;margin:0 auto;padding:16px} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:16px} .card{padding:16px;border:1px solid #e9ecef;border-radius:12px;background:#fff} .thumb{width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:12px} .meta{color:var(--muted-2);margin-top:8px} .btn{display:inline-block;margin-top:12px;background:var(--brand);color:#fff;padding:8px 12px;border-radius:8px;text-decoration:none}`
  ]
})
export class ServicesComponent {
  constructor(public data: MockDataService) {}
}
