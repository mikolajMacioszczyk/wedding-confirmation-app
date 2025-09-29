import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() { }

  /**
   * Generates a QR code as a data URL for the given public ID
   * @param publicId The public ID of the invitation
   * @returns Promise<string> Data URL of the QR code image
   */
  async generateQrCodeForInvitation(publicId: string): Promise<string> {
    const confirmationUrl = `${environment.frontendDomain}/potwierdz/${publicId}`;

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(confirmationUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }  /**
   * Downloads the QR code as a PNG file
   * @param publicId The public ID of the invitation
   * @param filename Optional filename (defaults to invitation-{publicId}.png)
   */
  async downloadQrCode(publicId: string, filename?: string): Promise<void> {
    try {
      const qrCodeDataUrl = await this.generateQrCodeForInvitation(publicId);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = filename || `invitation-${publicId}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      throw new Error('Failed to download QR code');
    }
  }

  /**
   * Gets the confirmation URL for a given public ID
   * @param publicId The public ID of the invitation
   * @returns The full confirmation URL
   */
  getConfirmationUrl(publicId: string): string {
    return `${environment.frontendDomain}/potwierdz/${publicId}`;
  }
}
