export interface InvitationDto {
  id: string;
  publicId: string;
  invitationText: string;
  creationDateTime: string;
  persons: PersonDto[];
}

export interface InvitationWithConfirmationInformationDto extends InvitationDto {
  haveConfirmation: boolean;
}

export interface PersonDto {
  id: string;
  firstName: string;
  lastName: string;
  description?: string | null;
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
  confirmedAt: string | null;
  isValid: boolean;
  selectedDrinkId: string | null;
}

export interface CreatePersonConfirmationCommand {
  invitationId: string;
  personId: string;
  confirmed: boolean;
  selectedDrinkId: string | null;
}

export interface UpdatePersonConfirmationCommand {
  id: string;
  confirmed: boolean;
  selectedDrinkId: string | null;
}

// Admin Commands
export interface CreateDrinkTypeCommand {
  type: string;
}

export interface CreatePersonCommand {
  firstName: string;
  lastName: string;
  description?: string | null;
}

export interface UpdatePersonCommand {
  id: string;
  firstName: string;
  lastName: string;
  description?: string | null;
}

export interface CreateInvitationCommand {
  publicId: string;
  invitationText: string;
}

export interface UpdateInvitationCommand {
  id: string;
  invitationText: string;
}
