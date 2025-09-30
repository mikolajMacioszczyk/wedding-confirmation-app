import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeddingApiService } from '../../services/wedding-api.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p class="dashboard-subtitle">Przegląd systemu potwierdzania obecności na weselu</p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📧</div>
          <div class="stat-content">
            <h3>{{ totalInvitations() }}</h3>
            <p>Zaproszenia</p>
            <a routerLink="/admin/invitations" class="stat-link">Zarządzaj →</a>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ totalPersons() }}</h3>
            <p>Osoby</p>
            <a routerLink="/admin/persons" class="stat-link">Zarządzaj →</a>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🥤</div>
          <div class="stat-content">
            <h3>{{ totalDrinkTypes() }}</h3>
            <p>Rodzaje napojów</p>
            <a routerLink="/admin/drink-types" class="stat-link">Zarządzaj →</a>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ totalConfirmations() }}</h3>
            <p>Potwierdzenia</p>
            <a routerLink="/admin/confirmations" class="stat-link">Zobacz →</a>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Ładowanie danych...</p>
        </div>
      }



      <div class="quick-actions">
        <h2>Szybkie akcje</h2>
        <div class="action-buttons">
          <a routerLink="/admin/invitations/new" class="action-btn primary">
            <span class="btn-icon">➕</span>
            Nowe zaproszenie
          </a>
          <a routerLink="/admin/persons/new" class="action-btn secondary">
            <span class="btn-icon">👤</span>
            Nowa osoba
          </a>
          <a routerLink="/admin/drink-types/new" class="action-btn secondary">
            <span class="btn-icon">🥤</span>
            Nowy napój
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }

    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2.5em;
    }

    .dashboard-subtitle {
      color: #6c757d;
      font-size: 1.1em;
      margin-bottom: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 2.5em;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .stat-content {
      flex: 1;
    }

    .stat-content h3 {
      font-size: 2em;
      margin: 0 0 5px 0;
      color: #333;
      font-weight: 700;
    }

    .stat-content p {
      margin: 0 0 10px 0;
      color: #6c757d;
      font-size: 1em;
    }

    .stat-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9em;
    }

    .stat-link:hover {
      text-decoration: underline;
    }

    .loading, .error {
      text-align: center;
      padding: 40px 20px;
      background: white;
      border-radius: 10px;
      margin: 20px 0;
    }

    .error {
      color: #dc3545;
    }

    .retry-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    }

    .retry-btn:hover {
      background: #c82333;
    }

    .quick-actions {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .quick-actions h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.5em;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-btn.secondary {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }

    .btn-icon {
      margin-right: 8px;
      font-size: 1.1em;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 20px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-btn {
        justify-content: center;
      }

      h1 {
        font-size: 2em;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  loading = signal<boolean>(false);

  totalInvitations = signal<number>(0);
  totalPersons = signal<number>(0);
  totalDrinkTypes = signal<number>(0);
  totalConfirmations = signal<number>(0);

  constructor(
    private weddingApi: WeddingApiService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    Promise.all([
      this.weddingApi.getAllInvitations().toPromise(),
      this.weddingApi.getAllPersons().toPromise(),
      this.weddingApi.getDrinkTypes().toPromise(),
      this.weddingApi.getAllPersonConfirmations().toPromise()
    ]).then(([invitations, persons, drinkTypes, confirmations]) => {
      this.totalInvitations.set(invitations?.length || 0);
      this.totalPersons.set(persons?.length || 0);
      this.totalDrinkTypes.set(drinkTypes?.length || 0);
      this.totalConfirmations.set(confirmations?.length || 0);
      this.loading.set(false);
    }).catch((err) => {
      console.error('Error loading dashboard data:', err);
      this.loading.set(false);
    });
  }
}
