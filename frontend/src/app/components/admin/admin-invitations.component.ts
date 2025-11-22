import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WeddingApiService } from '../../services/wedding-api.service';
import { QrCodeService } from '../../services/qr-code.service';
import { ToastService } from '../../services/toast.service';
import { InvitationDto, InvitationWithConfirmationInformationDto, PersonDto, CreateInvitationCommand, UpdateInvitationCommand } from '../../models/invitation.model';

@Component({
  selector: 'app-admin-invitations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="invitations-admin">
      <div class="header">
        <h1>Zaproszenia</h1>
        <div class="header-controls">
          <div class="filter-section">
            <label class="filter-label">
              <input
                type="checkbox"
                [checked]="showOnlyNotConfirmed()"
                (change)="toggleConfirmationFilter($event)"
                class="filter-checkbox"
              >
              <span class="filter-text">Tylko niepotwierdzone</span>
            </label>
            <label class="filter-label">
              <input
                type="checkbox"
                [checked]="showOnlyNotPrinted()"
                (change)="togglePrintedFilter($event)"
                class="filter-checkbox"
              >
              <span class="filter-text">Tylko niewydrukowane</span>
            </label>
            <label class="filter-label">
              <input
                type="checkbox"
                [checked]="showOnlyNotGiven()"
                (change)="toggleGivenFilter($event)"
                class="filter-checkbox"
              >
              <span class="filter-text">Tylko niewydane</span>
            </label>
          </div>
          <button (click)="showAddForm.set(!showAddForm())" class="btn btn-primary">
            {{ showAddForm() ? 'Anuluj' : '+ Dodaj zaproszenie' }}
          </button>
        </div>
      </div>

      @if (showAddForm()) {
        <div class="add-form">
          <h3>{{ editingInvitation() ? 'Edytuj zaproszenie' : 'Dodaj nowe zaproszenie' }}</h3>
          <form (ngSubmit)="saveInvitation()" class="form">
            <div class="form-group">
              <label for="publicId">Publiczny identyfikator:</label>
              <input
                type="text"
                id="publicId"
                [(ngModel)]="invitationForm.publicId"
                name="publicId"
                placeholder="np. kowalski-wesele-2025"
                [disabled]="!!editingInvitation()"
                required
              >
              @if (editingInvitation()) {
                <small class="form-help">Publiczny identyfikator nie może być zmieniony po utworzeniu</small>
              }
            </div>
            <div class="form-group">
              <label for="invitationText">Treść zaproszenia (opcjonalne):</label>
              <textarea
                id="invitationText"
                [(ngModel)]="invitationForm.invitationText"
                name="invitationText"
                placeholder="Treść zaproszenia (pozostaw puste jeśli nie potrzebujesz)..."
                rows="4"
              ></textarea>
            </div>
            @if (editingInvitation()) {
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    [(ngModel)]="invitationForm.isPrinted"
                    name="isPrinted"
                  >
                  <span>Wydrukowane</span>
                </label>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    [(ngModel)]="invitationForm.isGiven"
                    name="isGiven"
                  >
                  <span>Wydane</span>
                </label>
              </div>
              <div class="form-group">
                <div class="persons-management-inline">
                  <div class="persons-header-inline">
                    <label>Zaproszone osoby ({{ editingInvitation()!.persons.length || 0 }}):</label>
                    <button
                      type="button"
                      (click)="managePersonsInline()"
                      class="btn btn-link btn-sm"
                    >
                      Zarządzaj osobami
                    </button>
                  </div>
                  @if (editingInvitation()!.persons && editingInvitation()!.persons!.length > 0) {
                    <div class="persons-chips">
                      @for (person of editingInvitation()!.persons!; track person.id) {
                        <div class="person-chip-inline">
                          <span class="person-chip-name">{{ person.firstName }} {{ person.lastName }}</span>
                          @if (person.description) {
                            <span class="person-chip-description">{{ person.description }}</span>
                          }
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="no-persons-inline">Brak przypisanych osób</p>
                  }
                </div>
              </div>
            }

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="!isFormValid() || submitting()">
                {{ submitting() ? 'Zapisywanie...' : (editingInvitation() ? 'Zapisz zmiany' : 'Dodaj') }}
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
          <p>Ładowanie zaproszeń...</p>
        </div>
      } @else {
        <div class="invitations-list">
          @if (invitations().length === 0) {
            <div class="empty-state">
              <p>Brak zaproszeń. Dodaj pierwsze zaproszenie.</p>
            </div>
          } @else {
            <div class="invitations-grid">
              @for (invitation of filteredInvitations(); track invitation.id) {
                <div class="invitation-card" [class.confirmed]="invitation.haveConfirmation" [class.not-confirmed]="!invitation.haveConfirmation">
                  <div class="invitation-header">
                    <div class="invitation-title">
                      <h3>{{ invitation.publicId }}</h3>
                      <span class="confirmation-badge" [class.confirmed]="invitation.haveConfirmation" [class.not-confirmed]="!invitation.haveConfirmation">
                        {{ invitation.haveConfirmation ? '✓ Potwierdzone' : '⏳ Niepotwierdzone' }}
                      </span>
                    </div>
                    <div class="invitation-actions">
                      <button
                        (click)="editInvitation(invitation)"
                        class="btn btn-secondary btn-sm"
                      >
                        Edytuj
                      </button>
                    </div>
                  </div>

                  <div class="invitation-content">
                    <p class="invitation-text">{{ invitation.invitationText }}</p>
                    <p class="invitation-id">ID: {{ invitation.id }}</p>
                  </div>

                  <div class="invitation-persons">
                    <div class="persons-header">
                      <strong>Zaproszone osoby ({{ invitation.persons.length || 0 }}):</strong>
                      <button
                        (click)="managePersons(invitation)"
                        class="btn btn-link btn-sm"
                      >
                        Zarządzaj
                      </button>
                    </div>
                    @if (invitation.persons && invitation.persons.length > 0) {
                      <div class="persons-list">
                        @for (person of invitation.persons; track person.id) {
                          <div class="person-chip">
                            <span class="person-chip-name-main">{{ person.firstName }} {{ person.lastName }}</span>
                            @if (person.description) {
                              <span class="person-chip-description-main">{{ person.description }}</span>
                            }
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="no-persons">Brak przypisanych osób</p>
                    }
                  </div>

                  <div class="invitation-footer">
                    <div class="footer-actions">
                      <a [routerLink]="['/potwierdz', invitation.publicId]" target="_blank" class="btn btn-link btn-sm">
                        👁️ Podgląd
                      </a>
                      <button
                        (click)="showQrCode(invitation)"
                        class="btn btn-secondary btn-sm"
                        [disabled]="generatingQr().has(invitation.id)"
                      >
                        {{ generatingQr().has(invitation.id) ? 'Generowanie...' : '🔗 QR Code' }}
                      </button>
                      <button
                        (click)="downloadQrCode(invitation)"
                        class="btn btn-secondary btn-sm"
                        [disabled]="downloadingQr().has(invitation.id)"
                      >
                        {{ downloadingQr().has(invitation.id) ? 'Pobieranie...' : '⬇️ Pobierz QR' }}
                      </button>
                    </div>
                    <span class="invitation-url">
                      /potwierdz/{{ invitation.publicId }}
                    </span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Person Management Modal -->
      @if (managingInvitation()) {
        <div class="modal-overlay" (click)="closePersonManagement()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Zarządzaj osobami w zaproszeniu</h3>
              <button (click)="closePersonManagement()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              @if (loadingPersons()) {
                <p>Ładowanie osób...</p>
              } @else {
                <div class="persons-management">
                  <div class="available-persons-section">
                    <div class="section-header">
                      <h4>Dostępne osoby:</h4>
                      <div class="filter-toggle">
                        <label class="toggle-label">
                          <input
                            type="checkbox"
                            [checked]="filterUnassignedOnly()"
                            (change)="toggleFilter($event)"
                            class="toggle-checkbox"
                          >
                          <span class="toggle-text">Tylko nieprzypisane</span>
                        </label>
                      </div>
                    </div>
                    @if (availablePersons().length === 0) {
                      <div class="no-available-persons">
                        @if (allPersons().length === 0) {
                          <p>
                            Brak osób w systemie.
                            <a routerLink="/admin/persons" target="_blank">Dodaj osoby</a> najpierw.
                          </p>
                        } @else if (filterUnassignedOnly()) {
                          <p>
                            Wszystkie osoby są już przypisane do zaproszeń.
                            <a routerLink="/admin/persons" target="_blank">Dodaj nowe osoby</a>
                            lub <button type="button" (click)="toggleFilterOff()" class="link-button">wyłącz filtrowanie</button>.
                          </p>
                        } @else {
                          <p>
                            Brak dostępnych osób do dodania.
                          </p>
                        }
                      </div>
                    } @else {
                      <div class="available-persons">
                        <div class="persons-count">
                          Dostępne: {{ availablePersons().length }} z {{ allPersons().length }} osób
                        </div>
                        @for (person of availablePersons(); track person.id) {
                          <div class="person-item">
                            <div class="person-details">
                              <span class="person-name">{{ person.firstName }} {{ person.lastName }}</span>
                              @if (person.description) {
                                <span class="person-description">{{ person.description }}</span>
                              }
                            </div>
                            <button
                              (click)="addPersonToInvitation(person.id)"
                              class="btn btn-primary btn-sm"
                              [disabled]="assigningPersons().has(person.id)"
                            >
                              {{ assigningPersons().has(person.id) ? 'Dodawanie...' : 'Dodaj' }}
                            </button>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <h4>Osoby w zaproszeniu:</h4>
                  @if (!managingInvitation()?.persons || managingInvitation()!.persons!.length === 0) {
                    <p class="no-persons">Brak osób w zaproszeniu</p>
                  } @else {
                    <div class="assigned-persons">
                      @for (person of managingInvitation()!.persons!; track person.id) {
                        <div class="person-item">
                          <div class="person-details">
                            <span class="person-name">{{ person.firstName }} {{ person.lastName }}</span>
                            @if (person.description) {
                              <span class="person-description">{{ person.description }}</span>
                            }
                          </div>
                          <button
                            (click)="removePersonFromInvitation(person.id)"
                            class="btn btn-danger btn-sm"
                            [disabled]="removingPersons().has(person.id)"
                          >
                            {{ removingPersons().has(person.id) ? 'Usuwanie...' : 'Usuń' }}
                          </button>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- QR Code Modal -->
      @if (qrCodeModal()) {
        <div class="modal-overlay" (click)="closeQrCodeModal()">
          <div class="modal qr-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>QR Code dla zaproszenia</h3>
              <button (click)="closeQrCodeModal()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              @if (currentQrCode()) {
                <div class="qr-code-container">
                  <div class="qr-code-info">
                    <h4>{{ qrCodeModal()?.publicId }}</h4>
                    <p class="qr-url">{{ getConfirmationUrl(qrCodeModal()?.publicId || '') }}</p>
                  </div>
                  <div class="qr-code-image">
                    <img [src]="currentQrCode()" alt="QR Code" />
                  </div>
                  <div class="qr-actions">
                    <button
                      (click)="downloadCurrentQrCode()"
                      class="btn btn-primary"
                    >
                      ⬇️ Pobierz jako PNG
                    </button>
                    <button
                      (click)="copyQrUrl()"
                      class="btn btn-secondary"
                    >
                      📋 Kopiuj link
                    </button>
                  </div>
                </div>
              } @else {
                <div class="loading-qr">
                  <p>Generowanie kodu QR...</p>
                </div>
              }
            </div>
          </div>
        </div>
      }


    </div>
  `,
  styles: [`
    .invitations-admin {
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

    .header-controls {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .filter-section {
      display: flex;
      align-items: center;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9em;
      color: #495057;
      user-select: none;
    }

    .filter-checkbox {
      margin: 0;
      cursor: pointer;
    }

    .filter-text {
      font-weight: 500;
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

    .form-group input,
    .form-group textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      font-family: inherit;
      resize: vertical;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
    }

    .form-help {
      color: #6c757d;
      font-size: 0.85em;
      margin-top: 5px;
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

    .btn-link {
      background: transparent;
      color: #667eea;
      padding: 4px 8px;
    }

    .btn-link:hover {
      text-decoration: underline;
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

    .loading, .empty-state {
      text-align: center;
      padding: 40px 20px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .empty-state {
      color: #6c757d;
    }

    .invitations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .invitation-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .invitation-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .invitation-card.confirmed {
      border-left: 4px solid #28a745;
    }

    .invitation-card.not-confirmed {
      border-left: 4px solid #ffc107;
    }

    .invitation-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .invitation-title {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .invitation-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.2em;
    }

    .confirmation-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75em;
      font-weight: 600;
      text-transform: uppercase;
    }

    .confirmation-badge.confirmed {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .confirmation-badge.not-confirmed {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .invitation-text {
      color: #555;
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .invitation-id {
      margin: 0;
      color: #6c757d;
      font-size: 0.85em;
      font-family: monospace;
    }

    .invitation-persons {
      margin: 15px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .persons-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .persons-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .person-chip {
      display: flex;
      flex-direction: column;
      background: #667eea;
      color: white;
      padding: 6px 10px;
      border-radius: 12px;
      font-size: 0.85em;
    }

    .person-chip-name-main {
      font-weight: 500;
    }

    .person-chip-description-main {
      font-size: 0.9em;
      opacity: 0.9;
      margin-top: 2px;
      line-height: 1.2;
    }

    .no-persons, .no-available-persons {
      color: #6c757d;
      font-style: italic;
      margin: 0;
    }

    .invitation-footer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    .footer-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .invitation-url {
      font-family: monospace;
      color: #6c757d;
      font-size: 0.85em;
    }

    /* QR Code Modal */
    .qr-modal {
      max-width: 500px;
    }

    .qr-code-container {
      text-align: center;
    }

    .qr-code-info h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .qr-url {
      margin: 0 0 20px 0;
      color: #6c757d;
      font-family: monospace;
      font-size: 0.9em;
      word-break: break-all;
    }

    .qr-code-image {
      margin: 20px 0;
      padding: 20px;
      background: white;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .qr-code-image img {
      max-width: 100%;
      height: auto;
    }

    .qr-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }

    .loading-qr {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 10px;
      max-width: 800px;
      width: 90vw;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #333;
    }

    .modal-body {
      padding: 20px;
    }

    .persons-management h4 {
      color: #333;
      margin: 20px 0 10px 0;
      font-size: 1.1em;
    }

    .persons-management h4:first-child {
      margin-top: 0;
    }

    .available-persons-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .filter-toggle {
      display: flex;
      align-items: center;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9em;
      color: #495057;
    }

    .toggle-checkbox {
      margin: 0;
      cursor: pointer;
    }

    .toggle-text {
      user-select: none;
    }

    .filter-info {
      margin: 0;
      color: #6c757d;
      font-size: 0.9em;
      padding: 8px 12px;
      background: #e7f3ff;
      border-radius: 5px;
      border-left: 3px solid #0066cc;
    }

    .filter-info-disabled {
      background: #fff3cd;
      border-left-color: #ffc107;
      color: #856404;
    }

    .link-button {
      background: none;
      border: none;
      color: #0066cc;
      text-decoration: underline;
      cursor: pointer;
      font-size: inherit;
      font-family: inherit;
      padding: 0;
    }

    .link-button:hover {
      color: #0056b3;
    }

    .persons-count {
      font-size: 0.9em;
      color: #495057;
      font-weight: 500;
      padding: 8px 0;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 8px;
    }

    .available-persons,
    .assigned-persons {
      max-height: 50vh;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 10px;
    }

    .person-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      margin-bottom: 6px;
      transition: border-color 0.2s ease;
    }

    .person-item:hover {
      border-color: #adb5bd;
    }

    .person-item:last-child {
      margin-bottom: 0;
    }

    .person-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .person-name {
      font-weight: 500;
      color: #333;
    }

    .person-description {
      color: #6c757d;
      font-size: 0.85em;
      line-height: 1.3;
    }

    .no-available-persons {
      color: #6c757d;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
      text-align: center;
    }

    .no-available-persons p {
      margin: 0 0 8px 0;
    }

    .no-available-persons a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }

    .no-available-persons a:hover {
      text-decoration: underline;
    }

    /* Inline person management styles */
    .persons-management-inline {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 16px;
      background: #f8f9fa;
    }

    .persons-header-inline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .persons-header-inline label {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    .persons-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .person-chip-inline {
      display: flex;
      flex-direction: column;
      background: #e7f3ff;
      color: #0066cc;
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #b3d9ff;
    }

    .person-chip-name {
      font-size: 0.9em;
      font-weight: 500;
    }

    .person-chip-description {
      font-size: 0.8em;
      color: #0056b3;
      margin-top: 2px;
      line-height: 1.2;
    }

    .no-persons-inline {
      margin: 0;
      color: #6c757d;
      font-style: italic;
      font-size: 0.9em;
    }



    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .header-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .filter-section {
        justify-content: center;
      }

      .invitations-grid {
        grid-template-columns: 1fr;
      }

      .invitation-header,
      .persons-header,
      .invitation-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }

      .invitation-header {
        align-items: stretch;
      }

      .invitation-title {
        align-items: flex-start;
      }

      .footer-actions {
        flex-direction: column;
        gap: 5px;
      }

      .qr-actions {
        flex-direction: column;
        gap: 10px;
      }

      .form-actions {
        flex-direction: column;
      }

      .modal {
        width: 95vw;
        max-height: 90vh;
      }
    }
  `]
})
export class AdminInvitationsComponent implements OnInit {
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  editingInvitation = signal<InvitationDto | null>(null);

  loadingPersons = signal<boolean>(false);
  managingInvitation = signal<InvitationDto | null>(null);
  assigningPersons = signal<Set<string>>(new Set());
  removingPersons = signal<Set<string>>(new Set());

  // QR Code related signals
  generatingQr = signal<Set<string>>(new Set());
  downloadingQr = signal<Set<string>>(new Set());
  qrCodeModal = signal<InvitationDto | null>(null);
  currentQrCode = signal<string>('');

  invitations = signal<InvitationWithConfirmationInformationDto[]>([]);
  filteredInvitations = signal<InvitationWithConfirmationInformationDto[]>([]);
  showOnlyNotConfirmed = signal<boolean>(false);
  showOnlyNotPrinted = signal<boolean>(false);
  showOnlyNotGiven = signal<boolean>(false);
  allPersons = signal<PersonDto[]>([]);

  invitationForm = {
    publicId: '',
    invitationText: '',
    isPrinted: false,
    isGiven: false
  };

  availablePersons = signal<PersonDto[]>([]);
  filterUnassignedOnly = signal<boolean>(true); // Default to filtering enabled

  constructor(
    private weddingApi: WeddingApiService,
    private qrCodeService: QrCodeService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadInvitations();
  }

  loadInvitations() {
    this.loading.set(true);
    const onlyNotConfirmed = this.showOnlyNotConfirmed() ? true : undefined;
    const onlyNotPrinted = this.showOnlyNotPrinted() ? true : undefined;
    const onlyNotGiven = this.showOnlyNotGiven() ? true : undefined;

    this.weddingApi.getAllInvitations(onlyNotConfirmed, onlyNotPrinted, onlyNotGiven).subscribe({
      next: (invitations) => {
        // Sort invitations by CreationDateTime (newest first)
        const sortedInvitations = invitations.sort((a, b) =>
          new Date(b.creationDateTime).getTime() - new Date(a.creationDateTime).getTime()
        );
        this.invitations.set(sortedInvitations);
        this.updateFilteredInvitations();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading invitations:', err);
        this.loading.set(false);
      }
    });
  }

  updateFilteredInvitations() {
    const invitations = this.invitations();
    let filtered: InvitationWithConfirmationInformationDto[] = invitations;

    if (this.showOnlyNotConfirmed()) {
      filtered = filtered.filter(inv => !inv.haveConfirmation);
    }

    if (this.showOnlyNotPrinted()) {
      filtered = filtered.filter(inv => !inv.isPrinted);
    }

    if (this.showOnlyNotGiven()) {
      filtered = filtered.filter(inv => !inv.isGiven);
    }

    // Sort by CreationDateTime (newest first)
    const sorted = filtered.sort((a, b) =>
      new Date(b.creationDateTime).getTime() - new Date(a.creationDateTime).getTime()
    );

    this.filteredInvitations.set(sorted);
  }

  toggleConfirmationFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showOnlyNotConfirmed.set(target.checked);
    this.updateFilteredInvitations();
  }

  togglePrintedFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showOnlyNotPrinted.set(target.checked);
    this.updateFilteredInvitations();
  }

  toggleGivenFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showOnlyNotGiven.set(target.checked);
    this.updateFilteredInvitations();
  }

  isFormValid(): boolean {
    return this.invitationForm.publicId.trim() !== '';
  }

  saveInvitation() {
    if (!this.isFormValid()) return;

    this.submitting.set(true);

    const editingInvitationData = this.editingInvitation();
    if (editingInvitationData) {
      // Update existing invitation
      const command: UpdateInvitationCommand = {
        id: editingInvitationData.id,
        invitationText: this.invitationForm.invitationText.trim() || '',
        isPrinted: this.invitationForm.isPrinted,
        isGiven: this.invitationForm.isGiven
      };

      this.weddingApi.updateInvitation(command).subscribe({
        next: (updatedInvitation) => {
          this.toastService.showSuccess('Zaproszenie zostało zaktualizowane pomyślnie');
          this.cancelForm();
          this.loadInvitations();
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Error updating invitation:', err);
          this.submitting.set(false);
        }
      });
    } else {
      // Create new invitation
      const command: CreateInvitationCommand = {
        publicId: this.invitationForm.publicId.trim(),
        invitationText: this.invitationForm.invitationText.trim() || ''
      };

      this.weddingApi.createInvitation(command).subscribe({
        next: (invitation) => {
          this.toastService.showSuccess('Zaproszenie zostało dodane pomyślnie');
          this.cancelForm();
          this.loadInvitations();
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Error creating invitation:', err);
          this.submitting.set(false);
        }
      });
    }
  }

  editInvitation(invitation: InvitationDto) {
    this.editingInvitation.set(invitation);
    this.invitationForm.publicId = invitation.publicId;
    this.invitationForm.invitationText = invitation.invitationText;
    this.invitationForm.isPrinted = invitation.isPrinted;
    this.invitationForm.isGiven = invitation.isGiven;
    this.showAddForm.set(true);
  }

  managePersons(invitation: InvitationDto) {
    this.managingInvitation.set(invitation);
    this.loadPersonsForManagement();
  }

  managePersonsInline() {
    const editingInv = this.editingInvitation();
    if (editingInv) {
      this.managePersons(editingInv);
    }
  }

  closePersonManagement() {
    this.managingInvitation.set(null);
    this.availablePersons.set([]);
  }

  loadPersonsForManagement() {
    this.loadingPersons.set(true);

    this.weddingApi.getAllPersons().subscribe({
      next: (persons) => {
        const managing = this.managingInvitation();
        if (managing) {
          const currentInvitationPersonIds = new Set(managing.persons?.map(p => p.id) || []);

          if (this.filterUnassignedOnly()) {
            // Apply filtering: show only unassigned persons
            const allAssignedPersonIds = new Set<string>();

            // Collect person IDs from all invitations
            this.invitations().forEach(invitation => {
              invitation.persons?.forEach(person => {
                allAssignedPersonIds.add(person.id);
              });
            });

            // Filter out persons who are already assigned to any invitation
            // BUT keep persons who are assigned to the current invitation being managed
            const available = persons.filter(person => {
              // Include if not assigned to any invitation OR assigned to current invitation
              return !allAssignedPersonIds.has(person.id) || currentInvitationPersonIds.has(person.id);
            });

            // Remove persons already in current invitation from available list
            const finalAvailable = available.filter(person => !currentInvitationPersonIds.has(person.id));
            this.availablePersons.set(finalAvailable);
          } else {
            // No filtering: show all persons except those in current invitation
            const allAvailable = persons.filter(person => !currentInvitationPersonIds.has(person.id));
            this.availablePersons.set(allAvailable);
          }
        }
        this.allPersons.set(persons);
        this.loadingPersons.set(false);
      },
      error: (err) => {
        console.error('Error loading persons:', err);
        this.loadingPersons.set(false);
      }
    });
  }

  toggleFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterUnassignedOnly.set(target.checked);
    // Reload persons with new filter setting
    this.loadPersonsForManagement();
  }

  toggleFilterOff() {
    this.filterUnassignedOnly.set(false);
    // Reload persons with filter disabled
    this.loadPersonsForManagement();
  }

  addPersonToInvitation(personId: string) {
    const managing = this.managingInvitation();
    if (!managing) return;

    this.assigningPersons.update(set => new Set([...set, personId]));

    this.weddingApi.addPersonToInvitation(managing.id, personId).subscribe({
      next: (updatedInvitation) => {
        // Update the managing invitation
        this.managingInvitation.set(updatedInvitation);
        // Refresh invitations list and available persons
        this.loadInvitations();
        this.loadPersonsForManagement();
        this.toastService.showSuccess('Osoba została dodana do zaproszenia');
        this.assigningPersons.update(set => {
          const newSet = new Set(set);
          newSet.delete(personId);
          return newSet;
        });
      },
      error: (err) => {
        console.error('Error adding person to invitation:', err);
        this.assigningPersons.update(set => {
          const newSet = new Set(set);
          newSet.delete(personId);
          return newSet;
        });
      }
    });
  }

  removePersonFromInvitation(personId: string) {
    const managing = this.managingInvitation();
    if (!managing) return;

    this.removingPersons.update(set => new Set([...set, personId]));

    this.weddingApi.removePersonFromInvitation(managing.id, personId).subscribe({
      next: (updatedInvitation) => {
        // Update the managing invitation
        this.managingInvitation.set(updatedInvitation);
        // Refresh invitations list and available persons
        this.loadInvitations();
        this.loadPersonsForManagement();
        this.toastService.showSuccess('Osoba została usunięta z zaproszenia');
        this.removingPersons.update(set => {
          const newSet = new Set(set);
          newSet.delete(personId);
          return newSet;
        });
      },
      error: (err) => {
        console.error('Error removing person from invitation:', err);
        this.removingPersons.update(set => {
          const newSet = new Set(set);
          newSet.delete(personId);
          return newSet;
        });
      }
    });
  }

  cancelForm() {
    this.showAddForm.set(false);
    this.editingInvitation.set(null);
    this.invitationForm.publicId = '';
    this.invitationForm.invitationText = '';
    this.invitationForm.isPrinted = false;
    this.invitationForm.isGiven = false;
  }

  // QR Code Methods
  async showQrCode(invitation: InvitationDto) {
    this.generatingQr.update(set => new Set([...set, invitation.id]));
    this.qrCodeModal.set(invitation);
    this.currentQrCode.set('');

    try {
      const qrCodeDataUrl = await this.qrCodeService.generateQrCodeForInvitation(invitation.publicId);
      this.currentQrCode.set(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.closeQrCodeModal();
    } finally {
      this.generatingQr.update(set => {
        const newSet = new Set(set);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  }

  async downloadQrCode(invitation: InvitationDto) {
    this.downloadingQr.update(set => new Set([...set, invitation.id]));

    try {
      await this.qrCodeService.downloadQrCode(invitation.publicId);
      this.toastService.showSuccess('Kod QR został pobrany');
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      this.downloadingQr.update(set => {
        const newSet = new Set(set);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  }

  closeQrCodeModal() {
    this.qrCodeModal.set(null);
    this.currentQrCode.set('');
  }

  downloadCurrentQrCode() {
    const invitation = this.qrCodeModal();
    if (invitation) {
      this.downloadQrCode(invitation);
    }
  }

  async copyQrUrl() {
    const invitation = this.qrCodeModal();
    if (invitation) {
      const url = this.getConfirmationUrl(invitation.publicId);
      try {
        await navigator.clipboard.writeText(url);
        this.toastService.showSuccess('Link został skopiowany do schowka');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  }

  getConfirmationUrl(publicId: string): string {
    return this.qrCodeService.getConfirmationUrl(publicId);
  }


}
