import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WalletActionComponent } from './walletAction/wallet-action.component';
import { CurrencyInputComponent } from './currencyInput/currency-input.component';
import { DateEditorComponent } from './date-editor/date-editor.component';
import { WalletTableComponent } from './wallet-table/wallet-table.component';



@NgModule({
  declarations: [
    AppComponent,
    WalletActionComponent,
    CurrencyInputComponent,
    DateEditorComponent,
    WalletTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
