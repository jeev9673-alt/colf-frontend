import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
  <footer class="site-footer">
    <div class="container">
      <div class="col">
        <img src="/logo.svg" alt="Colf" style="width:54px;height:54px;" />
        <p style="margin-top:12px;color:var(--muted-2)">Local home services for tier2/3 cities — trusted professionals and easy booking.</p>
      </div>
      <div class="col">
        <h4>Company</h4>
        <ul>
          <li>About us</li>
          <li>Investor Relations</li>
          <li>Careers</li>
        </ul>
      </div>
      <div class="col">
        <h4>For customers</h4>
        <ul>
          <li>Categories near you</li>
          <li>Contact us</li>
        </ul>
      </div>
      <div class="col">
        <h4>For professionals</h4>
        <ul>
          <li>Register as a professional</li>
        </ul>
      </div>
    </div>
  </footer>
  `,
  styles: [
    `:host{display:block} .site-footer{background:#f7f8f9;color:var(--muted-2);padding:34px 0;margin-top:48px;border-top:1px solid #e9ecef} .site-footer .container{max-width:1200px;margin:0 auto;padding:0 16px;display:flex;gap:24px} .site-footer .col{flex:1} .site-footer h4{margin:0 0 10px;font-size:1rem} .site-footer ul{list-style:none;padding:0;margin:0} .site-footer li{margin-bottom:10px;font-size:13px;color:var(--muted-2)} .site-footer p{max-width:280px}`
  ]
})
export class Footer {
  readonly year = new Date().getFullYear();
}
