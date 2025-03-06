import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from './google-api.service';

describe('GoogleApiService', () => {
  let service: GoogleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize gapi client', async () => {
    spyOn(service as any, 'initializeGapiClient').and.callThrough();
    await service['initializeGapiClient']();
    expect(service['initializeGapiClient']).toHaveBeenCalled();
  });

  it('should create Google Calendar event', async () => {
    const eventDetails = {
      summary: 'Test Event',
      location: 'Test Location',
      description: 'Test Description',
      start: {
        dateTime: '2023-01-01T10:00:00Z',
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: '2023-01-01T11:00:00Z',
        timeZone: 'America/Los_Angeles'
      }
    };

    spyOn(gapi.client.calendar.events, 'insert').and.returnValue(Promise.resolve({ result: 'success' }));
    await service.createGoogleCalendarEvent(eventDetails);
    expect(gapi.client.calendar.events.insert).toHaveBeenCalledWith({
      calendarId: 'primary',
      resource: eventDetails
    });
  });

  it('should update Google Sheets', async () => {
    const spreadsheetId = 'testSpreadsheetId';
    const range = 'Sheet1!A1:E1';
    const values = [['test1', 'test2', 'test3', 'test4', 'test5']];

    spyOn(gapi.client.sheets.spreadsheets.values, 'append').and.returnValue(Promise.resolve({ result: 'success' }));
    await service.updateGoogleSheet(spreadsheetId, range, values);
    expect(gapi.client.sheets.spreadsheets.values.append).toHaveBeenCalledWith({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: { values }
    });
  });

  it('should submit payment to Google Form', async () => {
    const formId = 'testFormId';
    const formResponse = {
      responses: [
        {
          questionId: 'testQuestionId',
          answer: 'testAnswer'
        }
      ]
    };

    spyOn(gapi.client.forms.responses, 'create').and.returnValue(Promise.resolve({ result: 'success' }));
    await service.submitPaymentToGoogleForm(formId, formResponse);
    expect(gapi.client.forms.responses.create).toHaveBeenCalledWith({
      formId,
      resource: formResponse
    });
  });

  it('should fetch resources from Google Drive', async () => {
    const folderId = 'testFolderId';
    const mockFiles = [
      { id: 'file1', name: 'File 1', mimeType: 'application/pdf', webViewLink: 'http://example.com/file1', createdTime: '2023-01-01T00:00:00Z' },
      { id: 'file2', name: 'File 2', mimeType: 'application/pdf', webViewLink: 'http://example.com/file2', createdTime: '2023-01-02T00:00:00Z' }
    ];

    spyOn(gapi.client.drive.files, 'list').and.returnValue(Promise.resolve({ result: { files: mockFiles } }));
    const files = await service.fetchResourcesFromGoogleDrive(folderId);
    expect(gapi.client.drive.files.list).toHaveBeenCalledWith({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType, webViewLink, createdTime)'
    });
    expect(files).toEqual(mockFiles);
  });
});
