import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export class User {
  employeeCode: string;
  password: string;
  role: string;

  constructor(code: string, password: string, role: string) {
    this.employeeCode = code;
    this.password = password;
    this.role = role;
  }
}

@Injectable()
export class AuthService {

  currentUser: any = User;
  data: any;
  auth: any;
  empDetails: any;
  projDetails: any;
  monthReport: any;
  weeklyReport: any;

  public baseUrl = 'https://timesheet-4212c.firebaseio.com';

  constructor(private http: Http) {
    this.data = null;
    this.auth = null;
    this.empDetails = null;
    this.projDetails = null;

    this.loadAuthData();
  }

  public login(credentials) {
    if (credentials.employeeCode === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        // let access = (credentials.password === "prisam@1" && credentials.employeeCode === "e038");
        // this.currentUser = new User(credentials.employeeCode, credentials.password,"");

        var userData = null;
        var access = false;

        for (var i = 0; i < this.auth.length; i++) {

          userData = this.auth[i];
          access = (credentials.password === userData.password && credentials.employeeCode.toString().toLowerCase() === userData.employeeCode);

          if (access) {
            this.currentUser = new User(userData.employeeCode, userData.password, userData.role);
            break;
          }
        }

        if (access) {
          observer.next(userData);
        } else {
          observer.next(access);
        }

        observer.complete();
      });
    }
  }

  public register(credentials) {
    if (credentials.employeeCode !== null || credentials.password !== null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo(): User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  loadTodayReport(flag) {

    if (!flag)
      if (this.data) {
        return Promise.resolve(this.data);
      }

    return new Promise(resolve => {
      this.http.get(`${this.baseUrl}/today.json`)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.data = data;
          resolve(this.data);
        });
    });
  }

  loadEmployeeDetails() {
    if (this.empDetails) {
      return Promise.resolve(this.empDetails);
    }

    return new Promise(resolve => {
      this.http.get(`${this.baseUrl}/employeeDetails.json`)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.empDetails = data;
          resolve(this.empDetails);
        });
    });
  }

  loadProjectDetails() {
    if (this.projDetails) {
      return Promise.resolve(this.projDetails);
    }

    return new Promise(resolve => {
      this.http.get(`${this.baseUrl}/projectDetails.json`)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.projDetails = data;
          resolve(this.projDetails);
        });
    });
  }

  loadAuthData() {
    if (this.auth) {
      return Promise.resolve(this.auth);
    }

    return new Promise(resolve => {
      this.http.get(`${this.baseUrl}/auth.json`)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.auth = data;
          resolve(this.auth);
        });
    });
  }

  loadMonthReport() {
    if (this.monthReport) {
      return Promise.resolve(this.monthReport);
    }

    return new Promise(resolve => {
      this.http.get(`${this.baseUrl}/monthReport.json`)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.monthReport = data;
          resolve(this.monthReport);
        });
    });
  }

  loadWeeklyReport() {
    if (this.weeklyReport) {
      return Promise.resolve(this.weeklyReport);
    }

    return new Promise(resolve => {
      this.http.get(`${this.baseUrl}/weekly.json`)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.weeklyReport = data;
          resolve(this.weeklyReport);
        });
    });
  }
}
