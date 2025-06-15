import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {NewMockDataService} from './services/new-mock-data-service';
import {DataService} from './services/DataService';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    { provide: DataService, useClass: NewMockDataService }
  ]
};
