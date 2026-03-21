import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <header class="site-header">
    <div id="sr-announcer" class="sr-only" aria-live="polite"></div>
    <div class="container">
      <a class="brand" routerLink="/">
        <img src="/logo.svg" alt="Colf logo" class="brand-logo"/>
        <span class="brand-text">Colf</span>
      </a>

      <div class="center-block">
        <div class="search-card" role="search">
          <div class="loc">📍 <strong>City</strong></div>
          <input placeholder="Search for services, e.g. AC repair" aria-label="Search services" />
          <button class="btn">Search</button>
        </div>
      </div>

      <nav class="nav">
        <a routerLink="/">Home</a>
        <a routerLink="/services">Services</a>
        <a routerLink="/booking">Booking</a>
        <a routerLink="/dashboard">Dashboard</a>
      </nav>

      <button class="hamburger" aria-label="Open menu" (click)="openMenu()" aria-haspopup="true" [attr.aria-expanded]="menuOpen">
        <svg width="20" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 1h24v2H0V1zm0 6h24v2H0V7zm0 6h24v2H0v-2z" fill="currentColor"/></svg>
      </button>
    
    </div>

    <div *ngIf="menuOpen" class="menu-backdrop" (click)="closeMenu()"></div>

    <aside id="mobile-menu" class="mobile-menu" role="dialog" aria-modal="true" *ngIf="menuOpen">
      <div class="mobile-inner">
        <button class="close" aria-label="Close menu" (click)="closeMenu()">✕</button>
        <nav class="mobile-nav">
          <a routerLink="/" (click)="closeMenu()">Home</a>
          <a routerLink="/services" (click)="closeMenu()">Services</a>
          <a routerLink="/booking" (click)="closeMenu()">Booking</a>
          <a routerLink="/dashboard" (click)="closeMenu()">Dashboard</a>
        </nav>
      </div>
    </aside>
  `,
  styles: [
    `:host{display:block}
     .sr-only{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;border:0;padding:0;margin:-1px}
     .site-header{background:white;color:var(--text);padding:18px 0;position:sticky;top:0;z-index:55;border-bottom:1px solid #eef0f2}
     .site-header .container{display:flex;align-items:center;justify-content:space-between}
     .brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);font-weight:700}
     .brand-logo{width:40px;height:40px;transition:transform 220ms ease}
     .brand:hover .brand-logo{transform:scale(1.04)}
     .center-block{flex:1;display:flex;justify-content:center;margin:0 20px}
     .search-card{display:flex;gap:10px;align-items:center;padding:10px;border-radius:12px;border:1px solid #eef0f2;max-width:720px;width:100%;background:linear-gradient(90deg,#fff,#fff);transition:box-shadow 180ms ease}
     .search-card:focus-within{box-shadow:0 8px 30px rgba(15,23,42,0.06)}
     .search-card input{flex:1;border:0;background:transparent}
     .nav{display:flex;gap:14px}
     .nav a{color:var(--muted-2);text-decoration:none;padding:8px 10px;border-radius:8px;transition:all 150ms ease}
     .nav a:hover{background:color-mix(in srgb, var(--brand) 6%, transparent);color:var(--text);transform:translateY(-2px)}
     .hamburger{display:none;background:transparent;border:0;padding:8px;border-radius:8px}
     .hamburger svg{color:var(--muted-2)}

     /* mobile menu */
     .menu-backdrop{position:fixed;inset:0;background:rgba(11,17,23,0.45);backdrop-filter:blur(2px);z-index:90}
     .mobile-menu{position:fixed;right:0;top:0;height:100vh;width:320px;background:white;box-shadow:-20px 0 40px rgba(11,17,23,0.08);transform:translateX(0);z-index:100;animation:slide-in 260ms cubic-bezier(.2,.9,.2,1)}
     @keyframes slide-in{from{transform:translateX(100%)}to{transform:none}}
     .mobile-inner{padding:20px;display:flex;flex-direction:column;gap:12px}
     .mobile-nav{display:flex;flex-direction:column;gap:10px;margin-top:12px}
     .mobile-nav a{padding:12px;border-radius:8px;color:var(--muted-2);text-decoration:none}
     .mobile-nav a:hover{background:#f6f7f8}
     .mobile-menu .close{background:transparent;border:0;font-size:20px;align-self:flex-end}

     @media (max-width:900px){ .center-block{display:none} .nav{display:none} .hamburger{display:block} }
    `
  ]
})
export class Header {
  menuOpen = false;
  private _boundKeydown: ((e: KeyboardEvent) => void) | null = null;

  openMenu() {
    this.menuOpen = true;
    document.body.style.overflow = 'hidden';
    this._boundKeydown = this._onKeydown.bind(this);
    document.addEventListener('keydown', this._boundKeydown);
    // mark main content as hidden to assistive tech
    const main = document.querySelector('main');
    if (main) main.setAttribute('aria-hidden', 'true');

    // announce to screen readers
    const ann = document.getElementById('sr-announcer');
    if (ann) ann.textContent = 'Menu opened';

    // focus first focusable inside menu after it renders
    setTimeout(() => {
      const menu = document.getElementById('mobile-menu');
      if (!menu) return;
      const focusables = menu.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>;
      if (focusables.length) focusables[0].focus();
    }, 50);
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
    if (this._boundKeydown) document.removeEventListener('keydown', this._boundKeydown);
    this._boundKeydown = null;
    // unhide main content for assistive tech
    const main = document.querySelector('main');
    if (main) main.removeAttribute('aria-hidden');

    // announce to screen readers
    const ann = document.getElementById('sr-announcer');
    if (ann) ann.textContent = 'Menu closed';

    // return focus to hamburger
    setTimeout(() => {
      const btn = document.querySelector('.hamburger') as HTMLElement | null;
      btn?.focus();
    }, 50);
  }

  private _onKeydown(e: KeyboardEvent) {
    if (!this.menuOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      const menu = document.getElementById('mobile-menu');
      if (!menu) return;
      const focusables = Array.from(menu.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}
