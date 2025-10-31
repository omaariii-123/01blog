import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import {appConfig} from './app/app.config';

bootstrapApplication(App, appConfig).catch(err => console.error(err));

