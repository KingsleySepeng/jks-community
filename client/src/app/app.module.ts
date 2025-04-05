import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { GoogleApiService } from './google-api.service';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GoogleApiService],
})
export class AppModule {
  // async ngOnInit(): Promise<void> {
  //   await this.initializeGapiClient();
  // }

  // private async initializeGapiClient(): Promise<void> {
  //   await loadGapiInsideDOM();
  //   gapi.load('client:auth2', async () => {
  //     await gapi.client.init({
  //       apiKey: 'YOUR_API_KEY',
  //       clientId: 'YOUR_CLIENT_ID',
  //       discoveryDocs: [
  //         'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  //         'https://sheets.googleapis.com/$discovery/rest?version=v4',
  //         'https://www.googleapis.com/discovery/v1/apis/forms/v1/rest',
  //         'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  //       ],
  //       scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/drive.readonly'
  //     });
  //   });
  // }
}
