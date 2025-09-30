import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="home-card">
        <h1>Wesele Alicji i Mikołaja</h1>
        <p>Witamy w aplikacji do potwierdzania obecności na weselu.</p>

        <div class="qr-instructions">
          <h3>Jak potwierdzić obecność:</h3>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Zeskanuj kod QR</h4>
                <p>Użyj aparatu w telefonie lub aplikacji do skanowania kodów QR z Twojego zaproszenia</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Wybierz osoby</h4>
                <p>Zaznacz które osoby z Twojego zaproszenia potwierdzają obecność na weselu</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Wybierz napoje</h4>
                <p>Dla każdej potwierdzonej osoby wybierz główny rodzaj alkoholu, który planujesz pić</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>Zapisz potwierdzenie</h4>
                <p>Kliknij przycisk "Zapisz potwierdzenie" aby sfinalizować proces</p>
              </div>
            </div>
          </div>
        </div>

        <div class="help-section">
          <p><strong>Kod QR z zaproszenia nie działa?</strong></p>
          <p>Skontaktuj się z organizatorami wesela aby otrzymać link do potwierdzenia</p>
        </div>

        <div class="admin-link">
          <a routerLink="/admin" class="admin-button">Panel Administratora</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(248, 249, 250, 0.5) 0%, rgba(233, 236, 239, 0.5) 100%),
        url('/wedding-image.jpg') center/cover no-repeat;
      background-attachment: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }

    .home-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(24, 32, 111, 0.1);
      padding: 48px;
      max-width: 700px;
      width: 100%;
      text-align: center;
      border: 1px solid rgba(24, 32, 111, 0.08);
    }

    h1 {
      color: #18206F;
      margin-bottom: 24px;
      font-size: 2.5em;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      letter-spacing: -0.5px;
    }

    .home-card > p {
      color: #495057;
      font-size: 1.1em;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .qr-instructions {
      margin: 32px 0;
      padding: 32px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #D4AF37;
    }

    .qr-icon {
      font-size: 3em;
      margin-bottom: 16px;
      filter: grayscale(20%);
    }

    .qr-instructions h3 {
      color: #18206F;
      margin-bottom: 24px;
      font-size: 1.4em;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      transition: all 0.2s ease;
    }

    .step:hover {
      border-color: #D4AF37;
      box-shadow: 0 4px 12px rgba(24, 32, 111, 0.06);
    }

    .step-number {
      background: #18206F;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1em;
      flex-shrink: 0;
    }

    .step-content {
      text-align: left;
    }

    .step-content h4 {
      color: #18206F;
      margin: 0 0 8px 0;
      font-size: 1.1em;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .step-content p {
      color: #495057;
      margin: 0;
      line-height: 1.5;
      font-size: 0.95em;
    }

    .help-section {
      margin-top: 32px;
      padding: 20px;
      background: rgba(212, 175, 55, 0.1);
      border-radius: 12px;
      border-left: 4px solid #D4AF37;
    }

    .help-section p {
      margin: 6px 0;
      color: #495057;
    }

    .help-section strong {
      color: #18206F;
    }

    .admin-link {
      margin-top: 32px;
      text-align: center;
    }

    .admin-button {
      display: inline-block;
      padding: 12px 24px;
      background: #CBCBD4;
      color: #18206F;
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.95em;
      font-weight: 500;
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .admin-button:hover {
      background: #18206F;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 32, 111, 0.15);
    }

    @media (max-width: 768px) {
      .home-card {
        padding: 20px;
        margin: 10px;
      }

      h1 {
        font-size: 2em;
      }

      .qr-instructions {
        padding: 20px;
      }

      .step {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }

      .step-content {
        text-align: center;
      }

      .qr-icon {
        font-size: 2.5em;
      }
    }
  `]
})
export class HomeComponent {}
