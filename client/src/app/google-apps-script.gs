/**
 * Google Apps Script for JKS Community
 * This script handles event registrations, attendance tracking, fee payments, grading results, resource sharing, and announcements.
 */

/**
 * Function to create a new event in Google Calendar
 * @param {string} eventName - The name of the event
 * @param {string} location - The location of the event
 * @param {string} description - The description of the event
 * @param {string} startDateTime - The start date and time of the event (ISO format)
 * @param {string} endDateTime - The end date and time of the event (ISO format)
 */
function createEvent(eventName, location, description, startDateTime, endDateTime) {
  var calendar = CalendarApp.getDefaultCalendar();
  calendar.createEvent(eventName, new Date(startDateTime), new Date(endDateTime), {
    location: location,
    description: description
  });
}

/**
 * Function to update Google Sheets with attendance data
 * @param {string} spreadsheetId - The ID of the Google Sheets spreadsheet
 * @param {string} range - The range in the spreadsheet to update
 * @param {Array} values - The attendance data to update
 */
function updateAttendance(spreadsheetId, range, values) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(range);
  sheet.appendRow(values);
}

/**
 * Function to submit payment data to Google Forms
 * @param {string} formId - The ID of the Google Form
 * @param {Object} formResponse - The response data to submit
 */
function submitPayment(formId, formResponse) {
  var form = FormApp.openById(formId);
  var items = form.getItems();
  var response = form.createResponse();
  
  items.forEach(function(item) {
    var itemId = item.getId();
    var answer = formResponse[itemId];
    if (answer) {
      response.withItemResponse(item.asTextItem().createResponse(answer));
    }
  });
  
  response.submit();
}

/**
 * Function to update Google Sheets with grading data
 * @param {string} spreadsheetId - The ID of the Google Sheets spreadsheet
 * @param {string} range - The range in the spreadsheet to update
 * @param {Array} values - The grading data to update
 */
function updateGrading(spreadsheetId, range, values) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(range);
  sheet.appendRow(values);
}

/**
 * Function to fetch resources from Google Drive
 * @param {string} folderId - The ID of the Google Drive folder
 * @returns {Array} - The list of resources
 */
function fetchResources(folderId) {
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var resources = [];
  
  while (files.hasNext()) {
    var file = files.next();
    resources.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      webViewLink: file.getUrl(),
      createdTime: file.getDateCreated()
    });
  }
  
  return resources;
}
