import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  InvitationDto,
  InvitationWithConfirmationInformationDto,
  DrinkTypeDto,
  PersonDto,
  PersonConfirmationDto,
  CreatePersonConfirmationCommand,
  UpdatePersonConfirmationCommand,
  CreateDrinkTypeCommand,
  CreatePersonCommand,
  UpdatePersonCommand,
  CreateInvitationCommand,
  UpdateInvitationCommand
} from '../models/invitation.model';

@Injectable({
  providedIn: 'root'
})
export class WeddingApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get invitation by public ID
  getInvitationByPublicId(publicId: string): Observable<InvitationDto> {
    return this.http.get<InvitationDto>(`${this.baseUrl}/Invitations/by-public-id/${publicId}`);
  }

  // Get all available drink types
  getDrinkTypes(): Observable<DrinkTypeDto[]> {
    return this.http.get<DrinkTypeDto[]>(`${this.baseUrl}/DrinkTypes`);
  }

  // Get person confirmations by invitation ID
  getPersonConfirmationsByInvitation(invitationId: string): Observable<PersonConfirmationDto[]> {
    return this.http.get<PersonConfirmationDto[]>(`${this.baseUrl}/PersonConfirmations/by-invitation/${invitationId}`);
  }

  // Create person confirmation
  createPersonConfirmation(command: CreatePersonConfirmationCommand): Observable<PersonConfirmationDto> {
    return this.http.post<PersonConfirmationDto>(`${this.baseUrl}/PersonConfirmations`, command);
  }

  // Update person confirmation
  updatePersonConfirmation(command: UpdatePersonConfirmationCommand): Observable<PersonConfirmationDto> {
    return this.http.put<PersonConfirmationDto>(`${this.baseUrl}/PersonConfirmations`, command);
  }

  // ADMIN METHODS

  // Drink Types Management
  createDrinkType(command: CreateDrinkTypeCommand): Observable<DrinkTypeDto> {
    return this.http.post<DrinkTypeDto>(`${this.baseUrl}/DrinkTypes`, command);
  }

  getDrinkTypeById(id: string): Observable<DrinkTypeDto> {
    return this.http.get<DrinkTypeDto>(`${this.baseUrl}/DrinkTypes/${id}`);
  }

  deleteDrinkType(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DrinkTypes/${id}`);
  }

  // Persons Management
  getAllPersons(): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(`${this.baseUrl}/Persons`);
  }

  getPersonById(id: string): Observable<PersonDto> {
    return this.http.get<PersonDto>(`${this.baseUrl}/Persons/${id}`);
  }

  createPerson(command: CreatePersonCommand): Observable<PersonDto> {
    return this.http.post<PersonDto>(`${this.baseUrl}/Persons`, command);
  }

  updatePerson(command: UpdatePersonCommand): Observable<PersonDto> {
    return this.http.put<PersonDto>(`${this.baseUrl}/Persons`, command);
  }

  deletePerson(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Persons/${id}`);
  }

  // Invitations Management
  getAllInvitations(onlyNotConfirmed?: boolean): Observable<InvitationWithConfirmationInformationDto[]> {
    let params: Record<string, string> = {};
    if (onlyNotConfirmed !== undefined) {
      params['OnlyNotConfirmed'] = onlyNotConfirmed.toString();
    }
    return this.http.get<InvitationWithConfirmationInformationDto[]>(`${this.baseUrl}/Invitations`, { params });
  }

  getInvitationById(id: string): Observable<InvitationDto> {
    return this.http.get<InvitationDto>(`${this.baseUrl}/Invitations/${id}`);
  }

  createInvitation(command: CreateInvitationCommand): Observable<InvitationDto> {
    return this.http.post<InvitationDto>(`${this.baseUrl}/Invitations`, command);
  }

  updateInvitation(command: UpdateInvitationCommand): Observable<InvitationDto> {
    return this.http.put<InvitationDto>(`${this.baseUrl}/Invitations`, command);
  }

  // Add/Remove persons from invitation
  addPersonToInvitation(invitationId: string, personId: string): Observable<InvitationDto> {
    return this.http.post<InvitationDto>(`${this.baseUrl}/Invitations/${invitationId}/persons/${personId}`, {});
  }

  removePersonFromInvitation(invitationId: string, personId: string): Observable<InvitationDto> {
    return this.http.delete<InvitationDto>(`${this.baseUrl}/Invitations/${invitationId}/persons/${personId}`);
  }

  // Get all person confirmations
  getAllPersonConfirmations(): Observable<PersonConfirmationDto[]> {
    return this.http.get<PersonConfirmationDto[]>(`${this.baseUrl}/PersonConfirmations`);
  }
}
