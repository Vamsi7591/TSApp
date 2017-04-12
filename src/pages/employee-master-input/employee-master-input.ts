import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ViewController,AlertController } from 'ionic-angular';
import { Keyboard } from 'ionic-native';


@Component({
    selector: 'page-employee-master-input',
    templateUrl: 'employee-master-input.html'
})
export class EmployeeMasterInputPage {

    @ViewChild('employeeNameInput1') employeeNameInput1;
    @ViewChild('employeeCodeInput1') employeeCodeInput1;
    @ViewChild('emailIdInput1') emailIdInput1;
    @ViewChild('designationInput1') designationInput1;
    @ViewChild('mobileInput1') mobileInput1;
    @ViewChild('bloodGroupInput1') bloodGroupInput1;
    @ViewChild('passwordInput1') passwordInput1;

    public canEdit: boolean = false;
    public viewOrEdit: boolean = false;
    public projectDetails: any;

    empInfo = {
        employeeName: '',
        employeeCode: '',
        emailId: '',
        designation: '',
        mobile: '',
        bloodGroup: '',
        password:'',
        base64Image: 'assets/icon/user_icon.png',
        isAdmin: false
    };

    constructor(
        public navCtrl: NavController,
        public _platform: Platform,
        public _viewController: ViewController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {

        console.log('navParams : ', this.navParams.data);

        if (this.navParams.data.employeeCode != null) {
            this.viewOrEdit = true;
            this.canEdit = false;
            this.empInfo.employeeName = this.navParams.data.employeeName;
            this.empInfo.employeeCode = this.navParams.data.employeeCode;
            this.empInfo.emailId = this.navParams.data.employeeEmailId;
            if (this.navParams.data.employeeRole === 'admin') {
                this.empInfo.isAdmin = true;
            } else {
                this.empInfo.isAdmin = false;
            }
        }
        else {
            this.viewOrEdit = false;
            this.canEdit = true;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EmployeeMasterInputPage');
    }

    empInsert() {
        if (this.canEdit) {
            var alertMessage = '';
            if (this.viewOrEdit) {
                alertMessage = 'Employee updated sucessfully.';
            } else {
                alertMessage = 'Employee inserted sucessfully.';
            }
            console.log('Employee : ', this.empInfo);
            let alert = this.alertCtrl.create({
                title: 'Employee Master',
                subTitle: alertMessage,
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        // console.log('OK clicked');
                        this.navCtrl.pop();
                    }
                }]
            });
            alert.present();
        } else {
            this.canEdit = true;
        }
    }

    moveNext(v) {

        // if (v == "employeeName") {
        //     this.employeeCodeInput1.setFocus();
        // } else if (v == "employeeCode") {
        //     this.emailIdInput1.setFocus();
        // } else if (v == "emailId") {
        //     this.designationInput1.setFocus();
        // } else if (v == "designation") {
        //     this.mobileInput1.setFocus();
        // } else if (v == "mobile") {
        //     this.bloodGroupInput1.setFocus();
        // } else if (v == "bloodGroup") {
        //     this.passwordInput1.setFocus();
        // } else if (v == "password") {
        //
        //     if (this._platform.is('ios')) {
        //         Keyboard.disableScroll(true);
        //     } else {
        //         Keyboard.close();
        //     }
        //
        // }

    }


}
