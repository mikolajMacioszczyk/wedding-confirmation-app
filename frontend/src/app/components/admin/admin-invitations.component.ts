import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WeddingApiService } from '../../services/wedding-api.service';
import { QrCodeService } from '../../services/qr-code.service';
import { ToastService } from '../../services/toast.service';
import { InvitationDto, PersonDto, CreateInvitationCommand, UpdateInvitationCommand } from '../../models/invitation.model';

@Component({
  selector: 'app-admin-invitations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="invitations-admin">
      <div class="header">
        <h1>Zaproszenia</h1>
        <button (click)="showAddForm.set(!showAddForm())" class="btn btn-primary">
          {{ showAddForm() ? 'Anuluj' : '+ Dodaj zaproszenie' }}
        </button>
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
              <label for="invitationText">Treść zaproszenia:</label>
              <textarea
                id="invitationText"
                [(ngModel)]="invitationForm.invitationText"
                name="invitationText"
                placeholder="Treść zaproszenia..."
                rows="4"
                required
              ></textarea>
            </div>
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
              @for (invitation of invitations(); track invitation.id) {
                <div class="invitation-card">
                  <div class="invitation-header">
                    <h3>{{ invitation.publicId }}</h3>
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
                          <span class="person-chip">{{ person.firstName }} {{ person.lastName }}</span>
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
                  <h4>Dostępne osoby:</h4>
                  @if (availablePersons().length === 0) {
                    <p class="no-available-persons">
                      Brak dostępnych osób.
                      <a routerLink="/admin/persons" target="_blank">Dodaj osoby</a> najpierw.
                    </p>
                  } @else {
                    <div class="available-persons">
                      @for (person of availablePersons(); track person.id) {
                        <div class="person-item">
                          <span>{{ person.firstName }} {{ person.lastName }}</span>
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

                  <h4>Osoby w zaproszeniu:</h4>
                  @if (!managingInvitation()?.persons || managingInvitation()!.persons!.length === 0) {
                    <p class="no-persons">Brak osób w zaproszeniu</p>
                  } @else {
                    <div class="assigned-persons">
                      @for (person of managingInvitation()!.persons!; track person.id) {
                        <div class="person-item">
                          <span>{{ person.firstName }} {{ person.lastName }}</span>
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

    .invitation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .invitation-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.2em;
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
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85em;
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
      max-width: 600px;
      width: 90vw;
      max-height: 80vh;
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
    }

    .persons-management h4:first-child {
      margin-top: 0;
    }

    .available-persons,
    .assigned-persons {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 10px;
    }

    .person-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .person-item:last-child {
      border-bottom: none;
    }



    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
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

  invitations = signal<InvitationDto[]>([]);
  allPersons = signal<PersonDto[]>([]);

  invitationForm = {
    publicId: '',
    invitationText: ''
  };

  availablePersons = signal<PersonDto[]>([]);

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

    this.weddingApi.getAllInvitations().subscribe({
      next: (invitations) => {
        this.invitations.set(invitations);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading invitations:', err);
        this.loading.set(false);
      }
    });
  }

  isFormValid(): boolean {
    return this.invitationForm.publicId.trim() !== '' &&
           this.invitationForm.invitationText.trim() !== '';
  }

  saveInvitation() {
    if (!this.isFormValid()) return;

    this.submitting.set(true);

    const editingInvitationData = this.editingInvitation();
    if (editingInvitationData) {
      // Update existing invitation
      const command: UpdateInvitationCommand = {
        id: editingInvitationData.id,
        invitationText: this.invitationForm.invitationText.trim()
      };

      this.weddingApi.updateInvitation(command).subscribe({
        next: (updatedInvitation) => {
          this.invitations.update(invitations =>
            invitations.map(inv => inv.id === updatedInvitation.id ? updatedInvitation : inv)
          );
          this.toastService.showSuccess('Zaproszenie zostało zaktualizowane pomyślnie');
          this.cancelForm();
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
        invitationText: this.invitationForm.invitationText.trim()
      };

      this.weddingApi.createInvitation(command).subscribe({
        next: (invitation) => {
          this.invitations.update(invitations => [...invitations, invitation]);
          this.toastService.showSuccess('Zaproszenie zostało dodane pomyślnie');
          this.cancelForm();
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
    this.showAddForm.set(true);
  }

  managePersons(invitation: InvitationDto) {
    this.managingInvitation.set(invitation);
    this.loadPersonsForManagement();
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
          const assignedPersonIds = new Set(managing.persons?.map(p => p.id) || []);
          const available = persons.filter(p => !assignedPersonIds.has(p.id));
          this.availablePersons.set(available);
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

  addPersonToInvitation(personId: string) {
    const managing = this.managingInvitation();
    if (!managing) return;

    this.assigningPersons.update(set => new Set([...set, personId]));

    this.weddingApi.addPersonToInvitation(managing.id, personId).subscribe({
      next: (updatedInvitation) => {
        // Update the invitation in the list
        this.invitations.update(invitations =>
          invitations.map(inv => inv.id === updatedInvitation.id ? updatedInvitation : inv)
        );
        // Update the managing invitation
        this.managingInvitation.set(updatedInvitation);
        // Refresh available persons
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
        // Update the invitation in the list
        this.invitations.update(invitations =>
          invitations.map(inv => inv.id === updatedInvitation.id ? updatedInvitation : inv)
        );
        // Update the managing invitation
        this.managingInvitation.set(updatedInvitation);
        // Refresh available persons
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
