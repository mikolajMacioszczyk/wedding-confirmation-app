import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingApiService } from '../services/wedding-api.service';
import { ErrorHandlerService } from '../services/error-handler.service';
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
  selectedDrinkId: string | null;
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
        } @else if (invitation()) {
          <div class="invitation-content">
            <h1>Potwierdź swoje zaproszenie</h1>
            @if (invitation()!.invitationText) {
              <div class="invitation-text">
                <p>{{ invitation()!.invitationText }}</p>
              </div>
            }

            @if (personsWithConfirmations().length > 0) {
              <form (ngSubmit)="onSubmit()" class="confirmation-form">
                <h3>Osoby zaproszone:</h3>

                @for (personWithConf of personsWithConfirmations(); track personWithConf.person.id) {
                  <div class="person-row">
                    <div class="person-info">
                      <h4>{{ personWithConf.person.firstName }} {{ personWithConf.person.lastName }}</h4>
                    </div>

                    <div class="confirmation-controls">
                      <label class="toggle-container">
                        <input
                          type="checkbox"
                          [(ngModel)]="personWithConf.confirmed"
                          name="confirmed_{{ personWithConf.person.id }}"
                          (change)="onConfirmationChange(personWithConf)"
                        >
                        <span class="toggle-slider"></span>
                        {{ personWithConf.confirmed ? 'Będę na weselu' : 'Nie będę na weselu' }}
                      </label>

                      @if (personWithConf.confirmed) {
                        <div class="drink-selection">
                          <label for="drink_{{ personWithConf.person.id }}">Jaki alkohol głównie będziesz pić?</label>
                          <select
                            [(ngModel)]="personWithConf.selectedDrinkId"
                            name="drink_{{ personWithConf.person.id }}"
                            id="drink_{{ personWithConf.person.id }}"
                            required
                          >
                            <option [value]="null">-- Wybierz alkohol --</option>
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


          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(248, 249, 250, 0.5) 0%, rgba(233, 236, 239, 0.5) 100%),
        url('/wedding-image.jpg') center/cover no-repeat;
      background-attachment: fixed;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }

    .confirmation-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(248, 249, 250, 0.02);
      pointer-events: none;
    }

    .card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(24, 32, 111, 0.1);
      padding: 48px;
      max-width: 800px;
      width: 100%;
      border: 1px solid rgba(24, 32, 111, 0.08);
    }

    .loading {
      text-align: center;
      padding: 40px 20px;
      color: #18206F;
    }

    h1 {
      text-align: center;
      color: #18206F;
      margin-bottom: 40px;
      font-size: 2.5em;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      letter-spacing: -0.5px;
    }

    .invitation-text {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 40px;
      text-align: center;
    }

    .invitation-text p {
      margin: 0;
      font-size: 1.1em;
      line-height: 1.6;
      color: #495057;
    }

    h3 {
      color: #18206F;
      margin-bottom: 24px;
      font-size: 1.4em;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .person-row {
      background: #ffffff;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      transition: all 0.2s ease;
    }

    .person-row:hover {
      border-color: #D4AF37;
      box-shadow: 0 4px 12px rgba(24, 32, 111, 0.06);
    }

    .person-info h4 {
      margin: 0 0 16px 0;
      color: #18206F;
      font-size: 1.2em;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .confirmation-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: #18206F;
      padding: 12px 0;
      transition: all 0.2s ease;
      position: relative;
    }

    .toggle-container:hover {
      color: #D4AF37;
    }

    .toggle-container input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .toggle-slider {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
      background-color: #ccc;
      border-radius: 24px;
      margin-right: 12px;
      transition: all 0.3s ease;
    }

    .toggle-slider:before {
      content: '';
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-container input:checked + .toggle-slider {
      background-color: #D4AF37;
    }

    .toggle-container input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    .toggle-container input:focus + .toggle-slider {
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
    }

    .drink-selection {
      margin-left: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .drink-selection label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #495057;
      font-size: 0.95em;
    }

    .drink-selection select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1em;
      background: white;
      color: #495057;
      transition: all 0.2s ease;
    }

    .drink-selection select:focus {
      outline: none;
      border-color: #D4AF37;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.15);
    }

    .form-actions {
      text-align: center;
      margin-top: 40px;
    }

    .submit-btn {
      background: #18206F;
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .submit-btn:hover:not(:disabled) {
      background: #D4AF37;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 32, 111, 0.15);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 10px rgba(24, 32, 111, 0.2);
    }

    .no-persons {
      text-align: center;
      padding: 40px 20px;
      color: #CBCBD4;
      font-style: italic;
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
        confirmed: confirmation?.confirmed ?? true, // Default to true if no confirmation exists
        selectedDrinkId: confirmation?.selectedDrinkId || null
      };
    });
  });

  constructor(
    private route: ActivatedRoute,
    private weddingApi: WeddingApiService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const publicId = params['publicId'];
      if (publicId) {
        this.publicId.set(publicId);
        this.loadInvitation();
        this.loadDrinkTypes();
      } else {
        this.errorHandler.showError('Brak identyfikatora zaproszenia w URL', 'Błąd URL');
      }
    });
  }

  loadInvitation() {
    this.loading.set(true);

    this.weddingApi.getInvitationByPublicId(this.publicId()).subscribe({
      next: (invitation) => {
        this.invitation.set(invitation);
        this.loadPersonConfirmations(invitation.id);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading invitation:', err);
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

  onConfirmationChange(personWithConf: PersonWithConfirmation) {
    // Reset selectedDrinkId to null when unchecking confirmation
    if (!personWithConf.confirmed) {
      personWithConf.selectedDrinkId = null;
    }
  }

  isFormValid(): boolean {
    const persons = this.personsWithConfirmations();
    return persons.every(p => !p.confirmed || (p.confirmed && p.selectedDrinkId));
  }

  onSubmit() {
    if (!this.isFormValid() || !this.invitation()) return;

    this.submitting.set(true);

    const invitation = this.invitation()!;
    const persons = this.personsWithConfirmations();
    const requests = persons.map(personWithConf => {
      // Send null for selectedDrinkId when not confirmed
      const selectedDrinkId = personWithConf.confirmed ? personWithConf.selectedDrinkId : null;

      if (personWithConf.confirmation) {
        // Update existing confirmation
        return this.weddingApi.updatePersonConfirmation({
          id: personWithConf.confirmation.id,
          confirmed: personWithConf.confirmed,
          selectedDrinkId: selectedDrinkId
        });
      } else {
        // Create new confirmation
        return this.weddingApi.createPersonConfirmation({
          invitationId: invitation.id,
          personId: personWithConf.person.id,
          confirmed: personWithConf.confirmed,
          selectedDrinkId: selectedDrinkId
        });
      }
    });

    // Execute all requests
    Promise.all(requests.map(req => req.toPromise()))
      .then(() => {
        this.errorHandler.showSuccess('Potwierdzenia zostały zapisane pomyślnie!', 'Sukces');
        this.submitting.set(false);
        // Reload confirmations to get updated data
        this.loadPersonConfirmations(invitation.id);
      })
      .catch((err) => {
        console.error('Error saving confirmations:', err);
        this.submitting.set(false);
      });
  }
}
