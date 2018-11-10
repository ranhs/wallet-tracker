import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  private host : string = "host";
  private user : string = "user";
  private password: string = "password";
  private database: string = "database";

  ngOnInit() {
    this.host = localStorage.getItem("wallet-host")
    this.user = localStorage.getItem("wallet-user")
    this.password = localStorage.getItem("wallet-password")
    this.database = localStorage.getItem("wallet-database")
  }

  public onSaveClicked() {
    localStorage.setItem("wallet-host", this.host);
    localStorage.setItem("wallet-user", this.user);
    localStorage.setItem("wallet-password", this.password);
    localStorage.setItem("wallet-database", this.database);
  }
}
