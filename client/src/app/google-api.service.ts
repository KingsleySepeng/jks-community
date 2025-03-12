import { Injectable } from '@angular/core';
import { loadGapiInsideDOM } from 'gapi-script';
import {environment} from './environment';

declare var gapi: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private gapiLoaded = false;
  constructor() {
    this.initializeGapiClient();
  }

  public async initializeGapiClient(): Promise<void> {
    if (this.gapiLoaded) return;

    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: environment.apiKey,
        clientId: environment.clientId,
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
  public async signIn(): Promise<void> {
    if (!this.gapiLoaded) {
      await this.initializeGapiClient();
    }
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
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
    } catch (error: any) {
      // Check for 404 error code
      if (error.status === 404) {
        console.warn('Spreadsheet not found. Creating a new spreadsheet...');
        const newSpreadsheetId = await this.createNewSpreadsheet('Attendance Sheet');
        if (newSpreadsheetId) {
          // Optionally, update your application state with the new spreadsheetId.
          console.log('New spreadsheet created with ID:', newSpreadsheetId);
          // Retry updating the newly created spreadsheet
          await this.updateGoogleSheet(newSpreadsheetId, range, values);
        }
      } else {
        console.error('Error updating Google Sheets:', error);
      }
    }
  }

  public async createNewSpreadsheet(title: string): Promise<string | null> {
    try {
      const response = await gapi.client.sheets.spreadsheets.create({
        resource: {
          properties: {
            title: title,
          },
          sheets: [
            {
              properties: {
                title: "Sheet1",
              },
            },
          ],
        },
      });
      console.log('Spreadsheet created:', response);
      return response.result.spreadsheetId;
    } catch (error) {
      console.error('Error creating new spreadsheet:', error);
      return null;
    }
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
