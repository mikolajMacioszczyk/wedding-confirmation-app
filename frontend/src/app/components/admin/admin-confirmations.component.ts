import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingApiService } from '../../services/wedding-api.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { PersonConfirmationDto, InvitationDto, PersonDto, DrinkTypeDto } from '../../models/invitation.model';

interface ConfirmationWithDetails {
  confirmation: PersonConfirmationDto;
  invitation?: InvitationDto;
  person?: PersonDto;
  drinkType?: DrinkTypeDto;
}

@Component({
  selector: 'app-admin-confirmations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="confirmations-admin">
      <div class="header">
        <h1>Potwierdzenia obecności</h1>
        <div class="stats">
          <div class="stat">
            <span class="stat-number">{{ confirmedCount() }}</span>
            <span class="stat-label">Potwierdzone</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ totalCount() }}</span>
            <span class="stat-label">Łącznie</span>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Ładowanie potwierdzeń...</p>
        </div>
      } @else {
        @if (confirmationsWithDetails().length === 0) {
          <div class="empty-state">
            <p>Brak potwierdzeń. Potwierdzenia pojawią się gdy goście zaczną odpowiadać na zaproszenia.</p>
          </div>
        } @else {
          <div class="filters">
            <label>
              <input
                type="checkbox"
                [(ngModel)]="showOnlyConfirmed"
                (change)="filterConfirmations()"
              >
              Pokaż tylko potwierdzone
            </label>
          </div>

          <div class="confirmations-table">
            <div class="table-header">
              <div class="col-person">Osoba</div>
              <div class="col-invitation">Zaproszenie</div>
              <div class="col-status">Status</div>
              <div class="col-date">Data potwierdzenia</div>
              <div class="col-drink">Napój</div>
            </div>

            @for (item of filteredConfirmations(); track item.confirmation.id) {
              <div class="table-row" [class.confirmed]="item.confirmation.confirmed">
                <div class="col-person">
                  <div class="person-info">
                    <strong>{{ item.person?.firstName }} {{ item.person?.lastName }}</strong>
                    @if (item.person?.description) {
                      <span class="person-description">{{ item.person?.description }}</span>
                    }
                    <small>ID: {{ item.person?.id }}</small>
                  </div>
                </div>

                <div class="col-invitation">
                  <div class="invitation-info">
                    <strong>{{ item.invitation?.publicId }}</strong>
                    <small>{{ item.invitation?.invitationText | slice:0:50 }}{{ (item.invitation?.invitationText?.length || 0) > 50 ? '...' : '' }}</small>
                  </div>
                </div>

                <div class="col-status">
                  <span class="status-badge" [class.confirmed]="item.confirmation.confirmed">
                    {{ item.confirmation.confirmed ? '✅ Potwierdzone' : '❌ Odmowa' }}
                  </span>
                </div>

                <div class="col-date">
                  @if (item.confirmation.confirmed && item.confirmation.confirmedAt) {
                    <span class="date-info">{{ formatDate(item.confirmation.confirmedAt) }}</span>
                  } @else {
                    <span class="no-date">-</span>
                  }
                </div>

                <div class="col-drink">
                  @if (item.confirmation.confirmed && item.drinkType) {
                    <span class="drink-info">{{ item.drinkType.type }}</span>
                  } @else {
                    <span class="no-drink">-</span>
                  }
                </div>
              </div>
            }
          </div>

          <div class="summary">
            <h3>Podsumowanie napojów</h3>
            <div class="drinks-summary">
              @for (drink of drinksSummary(); track drink.drinkType) {
                <div class="drink-stat">
                  <span class="drink-name">{{ drink.drinkType }}</span>
                  <span class="drink-count">{{ drink.count }}</span>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .confirmations-admin {
      max-width: 1400px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #333;
      margin: 0;
    }

    .stats {
      display: flex;
      gap: 30px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      color: #6c757d;
      font-size: 0.9em;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 40px 20px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .error {
      color: #dc3545;
    }

    .empty-state {
      color: #6c757d;
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

    .filters {
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .filters label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: 500;
    }

    .filters input[type="checkbox"] {
      margin-right: 10px;
      transform: scale(1.2);
    }

    .confirmations-table {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1.8fr 1.8fr 1.2fr 1.5fr 1fr;
      background: #f8f9fa;
      padding: 15px 20px;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #dee2e6;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1.8fr 1.8fr 1.2fr 1.5fr 1fr;
      padding: 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.3s ease;
    }

    .table-row:hover {
      background: #f8f9fa;
    }

    .table-row.confirmed {
      background: rgba(40, 167, 69, 0.05);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .person-info,
    .invitation-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .person-info strong,
    .invitation-info strong {
      color: #333;
    }

    .person-description {
      color: #555;
      font-size: 0.9em;
      line-height: 1.4;
      margin: 2px 0;
    }

    .person-info small,
    .invitation-info small {
      color: #6c757d;
      font-size: 0.85em;
    }

    .person-info small {
      font-family: monospace;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.85em;
      font-weight: 500;
      background: #f8d7da;
      color: #721c24;
    }

    .status-badge.confirmed {
      background: #d4edda;
      color: #155724;
    }

    .drink-info {
      color: #333;
      font-weight: 500;
    }

    .no-drink {
      color: #6c757d;
      font-style: italic;
    }

    .date-info {
      color: #333;
      font-weight: 500;
      font-size: 0.9em;
    }

    .no-date {
      color: #6c757d;
      font-style: italic;
    }

    .valid-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 500;
      background: #fff3cd;
      color: #856404;
    }

    .valid-badge.valid {
      background: #d1ecf1;
      color: #0c5460;
    }

    .summary {
      background: white;
      border-radius: 10px;
      padding: 25px;
      margin-top: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .summary h3 {
      color: #333;
      margin-bottom: 20px;
    }

    .drinks-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .drink-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .drink-name {
      font-weight: 500;
      color: #333;
    }

    .drink-count {
      font-weight: bold;
      color: #667eea;
      font-size: 1.2em;
    }

    @media (max-width: 1200px) {
      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .table-header {
        display: none;
      }

      .table-row {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin-bottom: 10px;
      }

      .col-person::before { content: "Osoba: "; font-weight: bold; }
      .col-invitation::before { content: "Zaproszenie: "; font-weight: bold; }
      .col-status::before { content: "Status: "; font-weight: bold; }
      .col-date::before { content: "Data potwierdzenia: "; font-weight: bold; }
      .col-drink::before { content: "Napój: "; font-weight: bold; }
      .col-valid::before { content: "Ważność: "; font-weight: bold; }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .stats {
        justify-content: center;
      }

      .drinks-summary {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminConfirmationsComponent implements OnInit {
  loading = signal<boolean>(false);

  confirmations = signal<PersonConfirmationDto[]>([]);
  invitations = signal<InvitationDto[]>([]);
  persons = signal<PersonDto[]>([]);
  drinkTypes = signal<DrinkTypeDto[]>([]);

  showOnlyConfirmed = false;
  filteredConfirmations = signal<ConfirmationWithDetails[]>([]);

  confirmationsWithDetails = computed<ConfirmationWithDetails[]>(() => {
    const confirmationsList = this.confirmations();
    const invitationsList = this.invitations();
    const personsList = this.persons();
    const drinkTypesList = this.drinkTypes();

    return confirmationsList.map(confirmation => {
      const invitation = invitationsList.find(inv => inv.id === confirmation.invitationId);
      const person = personsList.find(p => p.id === confirmation.personId);
      const drinkType = drinkTypesList.find(dt => dt.id === confirmation.selectedDrinkId);

      return {
        confirmation,
        invitation,
        person,
        drinkType
      };
    });
  });

  confirmedCount = computed(() =>
    this.confirmations().filter(c => c.confirmed).length
  );

  totalCount = computed(() =>
    this.confirmations().length
  );

  drinksSummary = computed(() => {
    const confirmedWithDrinks = this.confirmationsWithDetails()
      .filter(item => item.confirmation.confirmed && item.drinkType);

    const drinkCounts = new Map<string, number>();

    confirmedWithDrinks.forEach(item => {
      const drinkName = item.drinkType!.type;
      drinkCounts.set(drinkName, (drinkCounts.get(drinkName) || 0) + 1);
    });

    return Array.from(drinkCounts.entries())
      .map(([drinkType, count]) => ({ drinkType, count }))
      .sort((a, b) => b.count - a.count);
  });

  constructor(
    private weddingApi: WeddingApiService,
    private errorHandler: ErrorHandlerService
  ) {
    // Initialize filtered confirmations with all confirmations
    this.filteredConfirmations.set(this.confirmationsWithDetails());
  }

  ngOnInit() {
    this.loadConfirmations();
  }

  loadConfirmations() {
    this.loading.set(true);

    Promise.all([
      this.weddingApi.getAllPersonConfirmations().toPromise(),
      this.weddingApi.getAllInvitations().toPromise(),
      this.weddingApi.getAllPersons().toPromise(),
      this.weddingApi.getDrinkTypes().toPromise()
    ]).then(([confirmations, invitations, persons, drinkTypes]) => {
      this.confirmations.set(confirmations || []);
      this.invitations.set(invitations || []);
      this.persons.set(persons || []);
      this.drinkTypes.set(drinkTypes || []);
      this.filterConfirmations();
      this.loading.set(false);
    }).catch((err) => {
      console.error('Error loading confirmations data:', err);
      this.loading.set(false);
    });
  }

  filterConfirmations() {
    const allConfirmations = this.confirmationsWithDetails();

    if (this.showOnlyConfirmed) {
      this.filteredConfirmations.set(
        allConfirmations.filter(item => item.confirmation.confirmed)
      );
    } else {
      this.filteredConfirmations.set(allConfirmations);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
