import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { EmployeeMasterInputPage } from '../employee-master-input/employee-master-input';

// import { ProfileViewPage } from '../profile-view/profile-view';

@Component({
    selector: 'page-employee-master',
    templateUrl: 'employee-master.html'
})
export class EmployeeMasterPage {
    public employeeDetails: any;

    constructor(
        public navCtrl: NavController,
        public auth: AuthService,
        public navParams: NavParams) {
        this.employeeDetails = null;
    }

    ionViewDidLoad() {
        this.loadEmployeeDetails();
        console.log('ionViewDidLoad EmployeeMasterPage : ', this.employeeDetails);
    }

    loadEmployeeDetails() {
        this.auth.loadEmployeeDetails()
            .then(data => {
                this.employeeDetails = data;
            });
    }

    addInput() {
        this.navCtrl.push(EmployeeMasterInputPage);
    }

    openView($event, item) {
        this.navCtrl.push(EmployeeMasterInputPage, item);
    }

}
