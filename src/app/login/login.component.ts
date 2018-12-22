import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  public currentName : string;
  public users: {[key:string]:UserInfo} = {};
  public name: string = "name";
  private _host : string = "host";
  private _user : string = "user";
  private _password: string = "password";
  private _database: string = "database";



  ngOnInit() {
    this.users = JSON.parse(localStorage.getItem("wallet-users-info"));
    this._host = localStorage.getItem("wallet-host")
    this._user = localStorage.getItem("wallet-user")
    this._password = localStorage.getItem("wallet-password")
    this._database = localStorage.getItem("wallet-database")
    if ( this._host == null ) this._host = "host";
    if ( this._user == null ) this._user = "user";
    if ( this._password == null ) this._password = "password";
    if ( this._database == null ) this._database = "database";
    if ( this.users == null ) {
      this.users = {};
      this.users['0'] = {
        host: this._host,
        user: this._user,
        password: this._password,
        database: this._database
      };
    }
    for (let name in this.users ) {
      let userInfo = this.users[name];
      if ( userInfo.host == this._host &&
           userInfo.user == this._user &&
           userInfo.password == this._password &&
           userInfo.database == this._database) {
             this.currentName = name;
             this.name = name;
             break;
           }
    }
  }

  public get host() : string {
    return this._host;
  }
  public set host(value: string) {
    this._host = value;
    this.users[this.currentName].host = value;
  }

  public get user() : string {
    return this._user;
  }
  public set user(value: string) {
    this._user = value;
    this.users[this.currentName].user = value;
  }

  public get password() : string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
    this.users[this.currentName].password = value;
  }

  
  public get database() : string {
    return this._database;
  }
  public set database(value: string) {
    this._database = value;
    this.users[this.currentName].database = value;
  }


  public onNameChanged() {
    let userInfo = this.users[this.currentName];
    if ( !userInfo ) return;
    if ( this.currentName == this.name ) return;
    this.users[this.name] = userInfo;
    delete this.users[this.currentName];
    this.currentName = this.name;
  }

  public onNameSelected() {
    if ( this.currentName == "add" ) {
      this.users["name"] = {
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
      };
      this.currentName = "name";
      this.name = "name"
      
    } else {
      let user = this.users[this.currentName];
      if (!user) {
        this.currentName = this.name;
        return;
      }
      this.name = this.currentName;
      this.host = user.host;
      this.user = user.user;
      this.password = user.password;
      this.database = user.database;
    }
  }

  public get names() : string[] {
    return Object.keys(this.users);
  }

  public onSaveClicked() {
    localStorage.setItem("wallet-users-info", JSON.stringify(this.users));
    localStorage.setItem("wallet-host", this.host);
    localStorage.setItem("wallet-user", this.user);
    localStorage.setItem("wallet-password", this.password);
    localStorage.setItem("wallet-database", this.database);
  }
}

class UserInfo {
  public host: string;
  public user: string;
  public password: string;
  public database: string;
}
