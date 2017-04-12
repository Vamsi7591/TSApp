import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
    selector: 'page-employee-project',
    templateUrl: 'employee-project.html'
})


export class EmployeeProjectPage {

    public employeeDetails: any;
    public projectDetails: any;
    empName: string="";
    projName: string;
    // empNameList: any = [];
    isChecked: boolean = false;

    constructor(
        public alertCtrl: AlertController,
        public auth: AuthService,
        public navCtrl: NavController,
        public events: Events,
        public navParams: NavParams) {
        this.employeeDetails = null;
        this.projectDetails = null;
    }

    ionViewDidLoad() {
        this.loadEmployeeDetails();
        this.loadProjectDetails();

        console.log('ionViewDidLoad EmployeeProjectPage');
    }

    loadEmployeeDetails() {
        this.auth.loadEmployeeDetails()
            .then(data => {
                this.employeeDetails = data;
            });
    }

    loadProjectDetails() {
        this.auth.loadProjectDetails()
            .then(data => {
                this.projectDetails = data;
            });
    }

    assignProject() {
        console.log(' Assigned To : ', this.projName, this.empName);

        let sTitle: any = "";

        // if (this.empNameList.length == 0 && this.projName == null) {
        //     sTitle = "Please select Project Name and Employee Name";
        // } else
        if (this.empName.length == 0 && this.projName == null) {
            sTitle = "Please select Project Name & Employee Name.";
        } else if (this.projName == null) {
            sTitle = "Please select Project Name.";
        } else if (this.empName.length == 0) {
            sTitle = "Please select Employee Name.";
        } else {
            let names = "";

            if (this.empName.length > 1) {

                for (let i = 0; i < this.empName.length; i++) {

                    if (i == (this.empName.length-1)) {
                        names += " & " + this.empName[i];

                    } else {
                      if (i == (this.empName.length-2)) {
                        names += this.empName[i] ;
                      }else{
                        names += this.empName[i] + ", ";
                      }
                    }
                }

            } else {
                names = this.empName;
            }
            sTitle = names + '\nassigned to ' + this.projName + '.';

        }

        let alert = this.alertCtrl.create({
            title: 'Employee Project',
            subTitle: '\n  ' + sTitle,
            buttons: ['OK']
        });
        alert.present();
    }

    // clickSelectBox($event, selValue) {
    //
    //     if (this.empNameList.length != 0) {
    //
    //         let checked = false;
    //
    //         for (var x in this.empNameList) {
    //             if (this.empNameList[x] == selValue) {
    //                 this.empNameList.splice(x, 1);
    //                 checked = true;
    //             }
    //         }
    //
    //         if (!checked) {
    //             this.empNameList.push(selValue);
    //         }
    //
    //
    //     } else {
    //         this.empNameList.push(selValue);
    //     }
    // }



}
