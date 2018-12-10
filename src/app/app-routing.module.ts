import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WalletTrackerComponent } from './wallet-tracker/wallet-tracker.component';

const routes : Routes = [
  { path: '', component: LoginComponent/*component: WalletTrackerComponent*/ },
  { path: 'login', component: LoginComponent }
]

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
