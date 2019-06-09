import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'src/guard/auth.guard';
import { GuestGuard } from 'src/guard/guest.guard';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLiteService } from 'src/services/sqlite.service';
import { DataControlService } from 'src/services/data-control.service';
import { FormsModule } from '@angular/forms';

const declare = [
  AppComponent,
  LoginComponent,
  RegisterComponent
]

@NgModule({
  declarations: declare,
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // guards
    AuthGuard,
    GuestGuard,
    // services
    SQLite,
    SQLiteService,
    DataControlService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
