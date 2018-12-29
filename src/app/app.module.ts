import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WalletActionComponent } from './walletAction/wallet-action.component';
import { CurrencyInputComponent } from './currencyInput/currency-input.component';
import { DateEditorComponent } from './date-editor/date-editor.component';
import { WalletTableComponent } from './wallet-table/wallet-table.component';
import { TransactionStorageService } from './transaction-storage.service';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { WalletTrackerComponent } from './wallet-tracker/wallet-tracker.component';
import { LoginInfoService } from './login-info.service';



@NgModule({
  declarations: [
    AppComponent,
    WalletActionComponent,
    CurrencyInputComponent,
    DateEditorComponent,
    WalletTableComponent,
    LoginComponent,
    WalletTrackerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    TransactionStorageService, 
    LoginInfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
