import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingApiService } from '../../services/wedding-api.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { DrinkTypeDto, CreateDrinkTypeCommand } from '../../models/invitation.model';

@Component({
  selector: 'app-admin-drink-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drink-types-admin">
      <div class="header">
        <h1>Rodzaje napojów</h1>
        <button (click)="showAddForm.set(!showAddForm())" class="btn btn-primary">
          {{ showAddForm() ? 'Anuluj' : '+ Dodaj napój' }}
        </button>
      </div>

      @if (showAddForm()) {
        <div class="add-form">
          <h3>Dodaj nowy rodzaj napoju</h3>
          <form (ngSubmit)="addDrinkType()" class="form">
            <div class="form-group">
              <label for="drinkType">Nazwa napoju:</label>
              <input
                type="text"
                id="drinkType"
                [(ngModel)]="newDrinkType"
                name="drinkType"
                placeholder="np. Piwo, Wino, Sok"
                required
              >
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="!newDrinkType.trim() || submitting()">
                {{ submitting() ? 'Dodawanie...' : 'Dodaj' }}
              </button>
              <button type="button" (click)="cancelAdd()" class="btn btn-secondary">
                Anuluj
              </button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <div class="loading">
          <p>Ładowanie rodzajów napojów...</p>
        </div>
      } @else {
        <div class="drink-types-list">
          @if (drinkTypes().length === 0) {
            <div class="empty-state">
              <p>Brak rodzajów napojów. Dodaj pierwszy rodzaj napoju.</p>
            </div>
          } @else {
            <div class="drink-types-grid">
              @for (drinkType of drinkTypes(); track drinkType.id) {
                <div class="drink-type-card">
                  <div class="drink-type-info">
                    <h3>{{ drinkType.type }}</h3>
                    <p class="drink-type-id">ID: {{ drinkType.id }}</p>
                  </div>
                  <div class="drink-type-actions">
                    <button
                      (click)="deleteDrinkType(drinkType.id, drinkType.type)"
                      class="btn btn-danger btn-sm"
                      [disabled]="deleting().has(drinkType.id)"
                    >
                      {{ deleting().has(drinkType.id) ? 'Usuwanie...' : 'Usuń' }}
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
    .drink-types-admin {
      max-width: 1000px;
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

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
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

    .btn-secondary:hover {
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

    .drink-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .drink-type-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .drink-type-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .drink-type-info h3 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1.2em;
    }

    .drink-type-id {
      margin: 0;
      color: #6c757d;
      font-size: 0.85em;
      font-family: monospace;
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

      .drink-types-grid {
        grid-template-columns: 1fr;
      }

      .drink-type-card {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminDrinkTypesComponent implements OnInit {
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  deleting = signal<Set<string>>(new Set());

  drinkTypes = signal<DrinkTypeDto[]>([]);
  newDrinkType = '';

  constructor(
    private weddingApi: WeddingApiService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadDrinkTypes();
  }

  loadDrinkTypes() {
    this.loading.set(true);

    this.weddingApi.getDrinkTypes().subscribe({
      next: (drinkTypes) => {
        this.drinkTypes.set(drinkTypes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading drink types:', err);
        this.loading.set(false);
      }
    });
  }

  addDrinkType() {
    if (!this.newDrinkType.trim()) return;

    this.submitting.set(true);

    const command: CreateDrinkTypeCommand = {
      type: this.newDrinkType.trim()
    };

    this.weddingApi.createDrinkType(command).subscribe({
      next: (drinkType) => {
        this.drinkTypes.update(types => [...types, drinkType]);
        this.errorHandler.showSuccess('Rodzaj napoju został dodany pomyślnie');
        this.cancelAdd();
        this.submitting.set(false);
      },
      error: (err) => {
        console.error('Error creating drink type:', err);
        this.submitting.set(false);
      }
    });
  }

  deleteDrinkType(id: string, typeName: string) {
    if (!confirm(`Czy na pewno chcesz usunąć rodzaj napoju "${typeName}"?`)) {
      return;
    }

    this.deleting.update(set => new Set([...set, id]));

    this.weddingApi.deleteDrinkType(id).subscribe({
      next: () => {
        this.drinkTypes.update(types => types.filter(t => t.id !== id));
        this.errorHandler.showSuccess('Rodzaj napoju został usunięty pomyślnie');
        this.deleting.update(set => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
      },
      error: (err) => {
        console.error('Error deleting drink type:', err);
        this.deleting.update(set => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  }

  cancelAdd() {
    this.showAddForm.set(false);
    this.newDrinkType = '';
  }


}
