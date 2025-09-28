import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingApiService } from '../services/wedding-api.service';
import {
  InvitationDto,
  DrinkTypeDto,
  PersonConfirmationDto,
  PersonDto
} from '../models/invitation.model';

interface PersonWithConfirmation {
  person: PersonDto;
  confirmation: PersonConfirmationDto | null;
  confirmed: boolean;
  selectedDrinkId: string;
}

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="confirmation-container">
      <div class="card">
        @if (loading()) {
          <div class="loading">
            <p>Ładowanie zaproszenia...</p>
          </div>
        } @else if (error()) {
          <div class="error">
            <h2>Błąd</h2>
            <p>{{ error() }}</p>
            <button (click)="loadInvitation()" class="retry-btn">Spróbuj ponownie</button>
          </div>
        } @else if (invitation()) {
          <div class="invitation-content">
            <h1>Potwierdzenie obecności</h1>
            <div class="invitation-text">
              <p>{{ invitation()!.invitationText }}</p>
            </div>

            @if (personsWithConfirmations().length > 0) {
              <form (ngSubmit)="onSubmit()" class="confirmation-form">
                <h3>Osoby zaproszone:</h3>

                @for (personWithConf of personsWithConfirmations(); track personWithConf.person.id) {
                  <div class="person-row">
                    <div class="person-info">
                      <h4>{{ personWithConf.person.firstName }} {{ personWithConf.person.lastName }}</h4>
                    </div>

                    <div class="confirmation-controls">
                      <label class="checkbox-container">
                        <input
                          type="checkbox"
                          [(ngModel)]="personWithConf.confirmed"
                          name="confirmed_{{ personWithConf.person.id }}"
                        >
                        <span class="checkmark"></span>
                        Potwierdza obecność
                      </label>

                      @if (personWithConf.confirmed) {
                        <div class="drink-selection">
                          <label for="drink_{{ personWithConf.person.id }}">Wybierz napój:</label>
                          <select
                            [(ngModel)]="personWithConf.selectedDrinkId"
                            name="drink_{{ personWithConf.person.id }}"
                            id="drink_{{ personWithConf.person.id }}"
                            required
                          >
                            <option value="">-- Wybierz napój --</option>
                            @for (drink of drinkTypes(); track drink.id) {
                              <option [value]="drink.id">{{ drink.type }}</option>
                            }
                          </select>
                        </div>
                      }
                    </div>
                  </div>
                }

                <div class="form-actions">
                  <button
                    type="submit"
                    class="submit-btn"
                    [disabled]="submitting() || !isFormValid()"
                  >
                    @if (submitting()) {
                      Zapisywanie...
                    } @else {
                      Zapisz potwierdzenia
                    }
                  </button>
                </div>
              </form>
            } @else {
              <div class="no-persons">
                <p>Brak osób przypisanych do tego zaproszenia.</p>
              </div>
            }

            @if (success()) {
              <div class="success-message">
                <h3>Sukces!</h3>
                <p>Potwierdzenia zostały zapisane pomyślnie.</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 800px;
      width: 100%;
    }

    .loading, .error {
      text-align: center;
      padding: 40px 20px;
    }

    .error {
      color: #dc3545;
    }

    .retry-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 15px;
    }

    .retry-btn:hover {
      background: #0056b3;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
      font-size: 2.5em;
    }

    .invitation-text {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      border-left: 4px solid #667eea;
    }

    .invitation-text p {
      margin: 0;
      font-size: 1.1em;
      line-height: 1.6;
      color: #555;
    }

    h3 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.4em;
    }

    .person-row {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 20px;
    }

    .person-info h4 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 1.2em;
    }

    .confirmation-controls {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 1.1em;
      font-weight: 500;
    }

    .checkbox-container input[type="checkbox"] {
      margin-right: 10px;
      transform: scale(1.2);
    }

    .drink-selection {
      margin-left: 30px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .drink-selection label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }

    .drink-selection select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 5px;
      font-size: 1em;
      background: white;
    }

    .drink-selection select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
    }

    .form-actions {
      text-align: center;
      margin-top: 30px;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 25px;
      font-size: 1.1em;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #c3e6cb;
      margin-top: 20px;
      text-align: center;
    }

    .success-message h3 {
      margin: 0 0 10px 0;
      color: #155724;
    }

    .success-message p {
      margin: 0;
    }

    .no-persons {
      text-align: center;
      padding: 40px 20px;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .card {
        padding: 20px;
        margin: 10px;
      }

      h1 {
        font-size: 2em;
      }

      .person-row {
        padding: 20px;
      }

      .drink-selection {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  `]
})
export class ConfirmationComponent implements OnInit {
  private publicId = signal<string>('');

  // State signals
  loading = signal<boolean>(false);
  error = signal<string>('');
  success = signal<boolean>(false);
  submitting = signal<boolean>(false);

  // Data signals
  invitation = signal<InvitationDto | null>(null);
  drinkTypes = signal<DrinkTypeDto[]>([]);
  personConfirmations = signal<PersonConfirmationDto[]>([]);

  // Computed signal for persons with their confirmations
  personsWithConfirmations = computed<PersonWithConfirmation[]>(() => {
    const inv = this.invitation();
    const confirmations = this.personConfirmations();

    if (!inv || !inv.persons) return [];

    return inv.persons.map(person => {
      const confirmation = confirmations.find(c => c.personId === person.id) || null;
      return {
        person,
        confirmation,
        confirmed: confirmation?.confirmed || false,
        selectedDrinkId: confirmation?.selectedDrinkId || ''
      };
    });
  });

  constructor(
    private route: ActivatedRoute,
    private weddingApi: WeddingApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const publicId = params['publicId'];
      if (publicId) {
        this.publicId.set(publicId);
        this.loadInvitation();
        this.loadDrinkTypes();
      } else {
        this.error.set('Brak identyfikatora zaproszenia w URL');
      }
    });
  }

  loadInvitation() {
    this.loading.set(true);
    this.error.set('');

    this.weddingApi.getInvitationByPublicId(this.publicId()).subscribe({
      next: (invitation) => {
        this.invitation.set(invitation);
        this.loadPersonConfirmations(invitation.id);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading invitation:', err);
        this.error.set('Nie udało się załadować zaproszenia. Sprawdź poprawność identyfikatora.');
        this.loading.set(false);
      }
    });
  }

  loadDrinkTypes() {
    this.weddingApi.getDrinkTypes().subscribe({
      next: (drinks) => {
        this.drinkTypes.set(drinks);
      },
      error: (err) => {
        console.error('Error loading drink types:', err);
      }
    });
  }

  loadPersonConfirmations(invitationId: string) {
    this.weddingApi.getPersonConfirmationsByInvitation(invitationId).subscribe({
      next: (confirmations) => {
        this.personConfirmations.set(confirmations);
      },
      error: (err) => {
        console.error('Error loading person confirmations:', err);
        // Don't show error for missing confirmations, they might not exist yet
      }
    });
  }

  isFormValid(): boolean {
    const persons = this.personsWithConfirmations();
    return persons.every(p => !p.confirmed || (p.confirmed && p.selectedDrinkId));
  }

  onSubmit() {
    if (!this.isFormValid() || !this.invitation()) return;

    this.submitting.set(true);
    this.error.set('');
    this.success.set(false);

    const invitation = this.invitation()!;
    const persons = this.personsWithConfirmations();
    const requests = persons.map(personWithConf => {
      if (personWithConf.confirmation) {
        // Update existing confirmation
        return this.weddingApi.updatePersonConfirmation({
          id: personWithConf.confirmation.id,
          confirmed: personWithConf.confirmed,
          selectedDrinkId: personWithConf.selectedDrinkId
        });
      } else {
        // Create new confirmation
        return this.weddingApi.createPersonConfirmation({
          invitationId: invitation.id,
          personId: personWithConf.person.id,
          confirmed: personWithConf.confirmed,
          selectedDrinkId: personWithConf.selectedDrinkId
        });
      }
    });

    // Execute all requests
    Promise.all(requests.map(req => req.toPromise()))
      .then(() => {
        this.success.set(true);
        this.submitting.set(false);
        // Reload confirmations to get updated data
        this.loadPersonConfirmations(invitation.id);
      })
      .catch((err) => {
        console.error('Error saving confirmations:', err);
        this.error.set('Nie udało się zapisać potwierdzeń. Spróbuj ponownie.');
        this.submitting.set(false);
      });
  }
}
