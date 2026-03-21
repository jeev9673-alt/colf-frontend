import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-left">
        <h1>Home services at your doorstep</h1>
        <p class="muted">Book trusted professionals for cleaning, AC, plumbing, electrical and more. Fast, reliable and affordable.</p>

        <div class="search-card" style="margin-top:20px;max-width:720px">
          <div class="loc">📍 <strong>Your city</strong></div>
          <input placeholder="Search services, e.g. AC repair" aria-label="Search services" />
          <button class="btn">Search</button>
        </div>

        <div style="margin-top:22px;display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn" routerLink="/services">View Services</a>
          <a class="link" routerLink="/booking">Book Now</a>
        </div>
      </div>

      <div class="hero-right">
        <div class="visual-grid">
          <img src="/images/Worker1.jpg" alt="worker" />
          <img src="/images/Plumber.jpg" alt="plumber" />
          <img src="/images/Electrician.jpg" alt="electrician" />
          <img src="/images/worker2.jpg" alt="worker2" />
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [
    `:host{display:block} .hero{padding:64px 0;background:linear-gradient(90deg,#fff,#fff)} .hero-grid{display:grid;grid-template-columns:1fr 520px;gap:28px;align-items:center} .hero-left{padding-right:20px} .hero-left h1{font-size:2.6rem;margin:0 0 12px;font-family:Poppins,Inter} .hero-left .muted{color:var(--muted-2);max-width:560px}
    .search-card{display:flex;gap:10px;align-items:center;padding:12px;border-radius:12px;border:1px solid #eef0f2;max-width:720px;background:#fff}
    .hero-right .visual-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .hero-right img{width:100%;height:180px;object-fit:cover;border-radius:12px}
    .btn{background:var(--brand);color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;display:inline-block}
    .link{margin-left:12px;text-decoration:underline;color:var(--brand);align-self:center}
    @media (max-width:900px){ .hero-grid{grid-template-columns:1fr} .hero-right{order:2} .hero-right img{height:140px} }
    `
  ]
})
export class Home {}
