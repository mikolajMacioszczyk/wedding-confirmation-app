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
        <h1>Wesele Alicji i Mikołaj</h1>
        <p>Witamy w aplikacji do potwierdzania obecności na weselu.</p>

        <div class="qr-instructions">
          <div class="qr-icon">📱</div>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .home-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
      font-size: 2.5em;
    }

    .qr-instructions {
      margin: 30px 0;
      padding: 30px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 15px;
      border: 2px solid #667eea;
    }

    .qr-icon {
      font-size: 3em;
      margin-bottom: 20px;
    }

    .qr-instructions h3 {
      color: #333;
      margin-bottom: 25px;
      font-size: 1.5em;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 15px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .step-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.1em;
      flex-shrink: 0;
    }

    .step-content {
      text-align: left;
    }

    .step-content h4 {
      color: #333;
      margin: 0 0 8px 0;
      font-size: 1.1em;
    }

    .step-content p {
      color: #666;
      margin: 0;
      line-height: 1.5;
    }

    .help-section {
      margin-top: 30px;
      padding: 20px;
      background: #fff3cd;
      border-radius: 10px;
      border-left: 4px solid #ffc107;
    }

    .help-section p {
      margin: 5px 0;
      color: #856404;
    }

    .help-section strong {
      color: #333;
    }

    .admin-link {
      margin-top: 2rem;
      text-align: center;
    }

    .admin-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 0.9rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .admin-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
