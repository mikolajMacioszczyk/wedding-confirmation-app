export interface InvitationDto {
  id: string;
  publicId: string;
  invitationText: string;
  persons: PersonDto[];
}

export interface PersonDto {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DrinkTypeDto {
  id: string;
  type: string;
}

export interface PersonConfirmationDto {
  id: string;
  invitationId: string;
  personId: string;
  confirmed: boolean;
  isValid: boolean;
  selectedDrinkId: string;
}

export interface CreatePersonConfirmationCommand {
  invitationId: string;
  personId: string;
  confirmed: boolean;
  selectedDrinkId: string;
}

export interface UpdatePersonConfirmationCommand {
  id: string;
  confirmed: boolean;
  selectedDrinkId: string;
}

// Admin Commands
export interface CreateDrinkTypeCommand {
  type: string;
}

export interface CreatePersonCommand {
  firstName: string;
  lastName: string;
}

export interface UpdatePersonCommand {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CreateInvitationCommand {
  publicId: string;
  invitationText: string;
}

export interface UpdateInvitationCommand {
  id: string;
  invitationText: string;
}
