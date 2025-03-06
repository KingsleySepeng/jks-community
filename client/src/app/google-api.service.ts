import { Injectable } from '@angular/core';
import { loadGapiInsideDOM } from 'gapi-script';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private gapiLoaded = false;

  constructor() {
    this.initializeGapiClient();
  }

  private async initializeGapiClient(): Promise<void> {
    if (this.gapiLoaded) return;

    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
          'https://sheets.googleapis.com/$discovery/rest?version=v4',
          'https://www.googleapis.com/discovery/v1/apis/forms/v1/rest',
          'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
        ],
        scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/drive.readonly'
      });
      this.gapiLoaded = true;
    });
  }

  public async createGoogleCalendarEvent(eventDetails: any): Promise<void> {
    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: eventDetails
      });
      console.log('Event created: ', response);
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  }

  public async updateGoogleSheet(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    const body = { values };

    try {
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: body
      });
      console.log('Data updated in Google Sheets');
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
    }
  }

  public async submitPaymentToGoogleForm(formId: string, formResponse: any): Promise<void> {
    try {
      const response = await gapi.client.forms.responses.create({
        formId: formId,
        resource: formResponse
      });
      console.log('Form response submitted: ', response);
    } catch (error) {
      console.error('Error submitting form response: ', error);
    }
  }

  public async fetchResourcesFromGoogleDrive(folderId: string): Promise<any[]> {
    try {
      const response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType, webViewLink, createdTime)'
      });

      return response.result.files || [];
    } catch (error) {
      console.error('Error fetching resources from Google Drive: ', error);
      return [];
    }
  }
}
