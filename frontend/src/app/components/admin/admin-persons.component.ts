import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingApiService } from '../../services/wedding-api.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { PersonDto, CreatePersonCommand, UpdatePersonCommand } from '../../models/invitation.model';

@Component({
  selector: 'app-admin-persons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="persons-admin">
      <div class="header">
        <h1>Osoby</h1>
        <button (click)="showAddForm.set(!showAddForm())" class="btn btn-primary">
          {{ showAddForm() ? 'Anuluj' : '+ Dodaj osobę' }}
        </button>
      </div>

      @if (showAddForm()) {
        <div class="add-form">
          <h3>{{ editingPerson() ? 'Edytuj osobę' : 'Dodaj nową osobę' }}</h3>
          <form (ngSubmit)="savePerson()" class="form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Imię:</label>
                <input
                  type="text"
                  id="firstName"
                  [(ngModel)]="personForm.firstName"
                  name="firstName"
                  placeholder="Imię"
                  required
                >
              </div>
              <div class="form-group">
                <label for="lastName">Nazwisko:</label>
                <input
                  type="text"
                  id="lastName"
                  [(ngModel)]="personForm.lastName"
                  name="lastName"
                  placeholder="Nazwisko"
                  required
                >
              </div>
            </div>
            <div class="form-group">
              <label for="description">Opis (opcjonalny):</label>
              <textarea
                id="description"
                [(ngModel)]="personForm.description"
                name="description"
                placeholder="Dodatkowe informacje o osobie"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="personForm.disableDrinks"
                  name="disableDrinks"
                >
                <span>Nie wyświetlaj pytania o alkohol</span>
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="!isFormValid() || submitting()">
                {{ submitting() ? 'Zapisywanie...' : (editingPerson() ? 'Zapisz zmiany' : 'Dodaj') }}
              </button>
              <button type="button" (click)="cancelForm()" class="btn btn-secondary">
                Anuluj
              </button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <div class="loading">
          <p>Ładowanie osób...</p>
        </div>
      } @else {
        <div class="persons-list">
          @if (persons().length === 0) {
            <div class="empty-state">
              <p>Brak osób. Dodaj pierwszą osobę.</p>
            </div>
          } @else {
            <div class="persons-grid">
              @for (person of persons(); track person.id) {
                <div class="person-card">
                  <div class="person-info">
                    <h3>{{ person.firstName }} {{ person.lastName }}</h3>
                    @if (person.description) {
                      <p class="person-description">{{ person.description }}</p>
                    }
                    <p class="person-id">ID: {{ person.id }}</p>
                  </div>
                  <div class="person-actions">
                    <button
                      (click)="editPerson(person)"
                      class="btn btn-secondary btn-sm"
                    >
                      Edytuj
                    </button>
                    <button
                      (click)="deletePerson(person.id, person.firstName + ' ' + person.lastName)"
                      class="btn btn-danger btn-sm"
                      [disabled]="deleting().has(person.id)"
                    >
                      {{ deleting().has(person.id) ? 'Usuwanie...' : 'Usuń' }}
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }


    </div>
  `,
  styles: [`
    .persons-admin {
      max-width: 1200px;
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

    .add-form {
      background: white;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }

    .add-form h3 {
      color: #333;
      margin-bottom: 20px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 5px;
      transition: background-color 0.2s ease;
    }

    .checkbox-label:hover {
      background: #e9ecef;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
    }

    .checkbox-label span {
      font-weight: 500;
      color: #333;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
    }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
    }

    .btn-sm {
      padding: 8px 12px;
      font-size: 12px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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

    .persons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .person-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .person-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .person-info h3 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1.2em;
    }

    .person-description {
      margin: 5px 0;
      color: #555;
      font-size: 0.95em;
      line-height: 1.4;
    }

    .person-id {
      margin: 0;
      color: #6c757d;
      font-size: 0.85em;
      font-family: monospace;
    }

    .person-actions {
      display: flex;
      gap: 8px;
      flex-direction: column;
    }

    .success-message {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .persons-grid {
        grid-template-columns: 1fr;
      }

      .person-card {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .person-actions {
        flex-direction: row;
        justify-content: space-between;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminPersonsComponent implements OnInit {
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  deleting = signal<Set<string>>(new Set());
  editingPerson = signal<PersonDto | null>(null);

  persons = signal<PersonDto[]>([]);

  personForm = {
    firstName: '',
    lastName: '',
    description: '',
    disableDrinks: false
  };

  constructor(
    private weddingApi: WeddingApiService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.loading.set(true);

    this.weddingApi.getAllPersons().subscribe({
      next: (persons) => {
        this.persons.set(persons);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading persons:', err);
        this.loading.set(false);
      }
    });
  }

  isFormValid(): boolean {
    return this.personForm.firstName.trim() !== '' && this.personForm.lastName.trim() !== '';
  }

  savePerson() {
    if (!this.isFormValid()) return;

    this.submitting.set(true);

    const editingPersonData = this.editingPerson();
    if (editingPersonData) {
      // Update existing person
      const command: UpdatePersonCommand = {
        id: editingPersonData.id,
        firstName: this.personForm.firstName.trim(),
        lastName: this.personForm.lastName.trim(),
        description: this.personForm.description.trim() || null,
        disableDrinks: this.personForm.disableDrinks
      };

      this.weddingApi.updatePerson(command).subscribe({
        next: (updatedPerson) => {
          this.persons.update(persons =>
            persons.map(p => p.id === updatedPerson.id ? updatedPerson : p)
          );
          this.errorHandler.showSuccess('Osoba została zaktualizowana pomyślnie');
          this.cancelForm();
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Error updating person:', err);
          this.submitting.set(false);
        }
      });
    } else {
      // Create new person
      const command: CreatePersonCommand = {
        firstName: this.personForm.firstName.trim(),
        lastName: this.personForm.lastName.trim(),
        description: this.personForm.description.trim() || null,
        disableDrinks: this.personForm.disableDrinks
      };

      this.weddingApi.createPerson(command).subscribe({
        next: (person) => {
          this.persons.update(persons => [...persons, person]);
          this.errorHandler.showSuccess('Osoba została dodana pomyślnie');
          this.cancelForm();
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Error creating person:', err);
          this.submitting.set(false);
        }
      });
    }
  }

  editPerson(person: PersonDto) {
    this.editingPerson.set(person);
    this.personForm.firstName = person.firstName;
    this.personForm.lastName = person.lastName;
    this.personForm.description = person.description || '';
    this.personForm.disableDrinks = person.disableDrinks || false;
    this.showAddForm.set(true);
  }

  deletePerson(id: string, fullName: string) {
    if (!confirm(`Czy na pewno chcesz usunąć osobę "${fullName}"?`)) {
      return;
    }

    this.deleting.update(set => new Set([...set, id]));

    this.weddingApi.deletePerson(id).subscribe({
      next: () => {
        this.persons.update(persons => persons.filter(p => p.id !== id));
        this.errorHandler.showSuccess('Osoba została usunięta pomyślnie');
        this.deleting.update(set => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
      },
      error: (err) => {
        console.error('Error deleting person:', err);
        this.deleting.update(set => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  }

  cancelForm() {
    this.showAddForm.set(false);
    this.editingPerson.set(null);
    this.personForm.firstName = '';
    this.personForm.lastName = '';
    this.personForm.description = '';
    this.personForm.disableDrinks = false;
  }


}
