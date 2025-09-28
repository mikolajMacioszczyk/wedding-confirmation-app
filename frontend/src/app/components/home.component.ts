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
        <h1>Wedding Confirmation App</h1>
        <p>Witamy w aplikacji do potwierdzania obecności na weselu.</p>
        <div class="instructions">
          <h3>Jak korzystać z aplikacji:</h3>
          <ol>
            <li>Kliknij w link otrzymany w zaproszeniu</li>
            <li>Lub wpisz w przeglądarce: <code>/potwierdz/[TwojIdentyfikator]</code></li>
            <li>Wybierz osoby które potwierdzają obecność</li>
            <li>Wybierz napoje dla każdej potwierdzonej osoby</li>
            <li>Kliknij "Zapisz potwierdzenia"</li>
          </ol>
        </div>
        <div class="example">
          <p>Przykład: <a routerLink="/potwierdz/sample">potwierdz/sample</a></p>
        </div>

        <div class="admin-section">
          <h3>Dla administratorów</h3>
          <p>Zarządzaj zaproszeniami, osobami i rodzajami napojów</p>
          <a routerLink="/admin" class="admin-link">
            🔧 Panel administratora
          </a>
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

    .instructions {
      text-align: left;
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .instructions h3 {
      color: #333;
      margin-bottom: 15px;
    }

    .instructions ol {
      color: #555;
      line-height: 1.6;
    }

    .instructions li {
      margin-bottom: 8px;
    }

    .instructions code {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: #d73a49;
    }

    .example {
      margin-top: 20px;
    }

    .example a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .example a:hover {
      text-decoration: underline;
    }

    .admin-section {
      margin-top: 30px;
      padding: 20px;
      background: #e3f2fd;
      border-radius: 10px;
      border-left: 4px solid #2196f3;
    }

    .admin-section h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .admin-section p {
      color: #555;
      margin-bottom: 15px;
    }

    .admin-link {
      display: inline-block;
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .admin-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
    }

    @media (max-width: 768px) {
      .home-card {
        padding: 20px;
        margin: 10px;
      }

      h1 {
        font-size: 2em;
      }
    }
  `]
})
export class HomeComponent {}
