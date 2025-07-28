import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {DataService} from './services/DataService';
import {ServiceService} from './services/service.service';
import {HttpClientModule} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(HttpClientModule),
     provideRouter(routes),
    { provide: DataService, useClass: ServiceService }
  ]
};
