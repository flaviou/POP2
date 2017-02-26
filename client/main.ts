import 'angular2-meteor-polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { AppModule } from './imports/app/app.module';
import '../both/methods/parties.methods';
import 'hammerjs';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
