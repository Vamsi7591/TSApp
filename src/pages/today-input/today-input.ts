import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EmailComposer } from 'ionic-native';

import { AuthService } from '../../providers/auth-service';
import * as moment from 'moment';
import * as firebase from 'firebase';

@Component({
    selector: 'page-today-input',
    templateUrl: 'today-input.html'
})
export class TodayInputPage {

    public currentDate: string;
    public minDate: string;
    public myDate: any;

    dateNow: string;
    timeStarts: string;
    timeEnds: string;

    public viewOrEdit: boolean = false;
    public canEdit: boolean = false;
    myIcon: string = "";

    public projectDetails: any;

    todayInsertData = {
        _projectName: '',
        _dateNow: '',
        _timeStarts: '',
        _timeEnds: '',
        _timeDiff: '',
        _taskDescription: ''
    };
    assetCollection;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public auth: AuthService,
        public navParams: NavParams) {

        console.log('navParams : ', this.navParams.data);

        this.myDate = new Date();

        if (this.navParams.data.date != null) {
            this.viewOrEdit = true;
            this.canEdit = false;

            var _m = '0';
            if (parseInt(this.navParams.data.date.substring(0, 2)) <= 10) {
                _m = '0' + (parseInt(this.navParams.data.date.substring(0, 2)) - 1);
            } else {
                _m = '' + (parseInt(this.navParams.data.date.substring(0, 2)) - 1);
            }

            this.myDate.setMonth(_m);
            this.myDate.setDate(this.navParams.data.date.substring(3, 5));
            this.myDate.setFullYear(this.navParams.data.date.substring(6, 10));

            this.currentDate = this.myDate.toISOString();
            this.todayInsertData._dateNow = this.myDate.toISOString();
            this.todayInsertData._timeStarts = this.navParams.data.startTime;
            this.todayInsertData._timeEnds = this.navParams.data.endTime;
            this.todayInsertData._projectName = this.navParams.data.projectName;
            this.todayInsertData._taskDescription = this.navParams.data.taskDescription;
            this.todayInsertData._timeDiff = this.navParams.data.totalHours;

        } else {
            this.viewOrEdit = false;
            this.canEdit = true;

            this.currentDate = this.myDate.toISOString();
            this.todayInsertData._dateNow = this.currentDate;
        }


        let reqDate = new Date();
        let _fullDate = (1 + this.myDate.getMonth()) + "/" + this.myDate.getDate() + "/" + this.myDate.getFullYear();

        if (this.myDate.getDate() > 7) {
            if (this.myDate.getMonth() == 0) {
                reqDate.setDate(this.myDate.getDate() - 7);
            } else {
                reqDate.setMonth(11);
            }
        }
        else {
            if (this.myDate.getMonth() == 0) {
                reqDate.setFullYear(this.myDate.getFullYear() - 1);
                reqDate.setMonth(11);
                reqDate.setDate(22);
            } else {
                reqDate.setMonth(this.myDate.getMonth() - 1);
                reqDate.setDate(22);
            }
        }

        this.minDate = reqDate.toISOString();

        let weeknumber = moment(_fullDate, "MM/DD/YYYY").week();


        console.log('Weeknumber : ', weeknumber);
        console.log('Date : ', this.myDate.getDate());
        console.log('Month : ', (1 + this.myDate.getMonth()));
        console.log('Year : ', this.myDate.getFullYear());


        if (this.viewOrEdit) {
            // Save form
            this.myIcon = "done-all";
        } else {
            // Edit form
            this.myIcon = "done-all";
        }

        this.loadFirebaseData();
    }

    loadFirebaseData() {

        var result = [];
        // load data from firebase...
        firebase.database().ref('today').orderByKey().once('value', (_snapshot: any) => {

            _snapshot.forEach((_childSnapshot) => {
                // get the key/id and the data for display
                var element = _childSnapshot.val();
                element.id = _childSnapshot.key;

                result.push(element);
            });
            console.log("firebase : ", result);
            this.assetCollection = result;
        });

    }

    changeStartTime() {
        console.log('_timeStarts : ', this.todayInsertData._timeStarts);

        var _sT = '';
        var _eT = '';
        var message = '';
        this.todayInsertData._timeDiff = '';

        if (this.todayInsertData._timeStarts.length != 0) {
            _sT = this.todayInsertData._timeStarts.replace(/[^a-zA-Z0-9]/g, '');
        }

        if (this.todayInsertData._timeEnds.length != 0) {
            _eT = this.todayInsertData._timeEnds.replace(/[^a-zA-Z0-9]/g, '');
        }

        if (_eT.length != 0 && _sT.length != 0) {

            if (_eT > _sT) {
                var mins = moment.utc(moment(this.todayInsertData._timeEnds, "HH:mm")
                    .diff(moment(this.todayInsertData._timeStarts, "HH:mm"))).format("HH:mm");

                console.log('Difference : ', mins);
                // message = "Duration : " + mins;
                message = '';
                this.todayInsertData._timeDiff = mins;
            } else if (_eT == _sT) {
                console.log(': Equal : ');
                message = "Start time and end time should be different.";
            } else {
                console.log(': invalid : ');
                message = "Invalid time selection.";
            }
        }

        let alert = this.alertCtrl.create({
            title: 'Time',
            subTitle: message,
            buttons: [{
                text: 'OK',
                handler: () => {
                    console.log('OK clicked');
                    // this.navCtrl.pop();
                }
            }]
        });

        if (message.length != 0) {
            alert.present();
        }
    }

    changeEndTime() {
        console.log('_timeEnds : ', this.todayInsertData._timeEnds);

        var _sT = '';
        var _eT = '';
        var message = '';
        this.todayInsertData._timeDiff = '';

        if (this.todayInsertData._timeStarts.length != 0) {
            _sT = this.todayInsertData._timeStarts.replace(/[^a-zA-Z0-9]/g, '');
        }

        if (this.todayInsertData._timeEnds.length != 0) {
            _eT = this.todayInsertData._timeEnds.replace(/[^a-zA-Z0-9]/g, '');
        }

        if (_eT.length != 0 && _sT.length != 0) {

            if (_eT > _sT) {
                var mins = moment.utc(moment(this.todayInsertData._timeEnds, "HH:mm")
                    .diff(moment(this.todayInsertData._timeStarts, "HH:mm"))).format("HH:mm");

                console.log('Difference : ', mins);
                // message = "Duration : " + mins;
                message = '';
                this.todayInsertData._timeDiff = mins;
            } else if (_eT == _sT) {
                console.log(': Equal : ');
                message = "Start time and end time should be different.";
                this.todayInsertData._timeDiff = null;
            } else {
                console.log(': invalid : ');
                message = "Invalid time selection.";
                this.todayInsertData._timeDiff = null;
            }
        }

        let alert = this.alertCtrl.create({
            title: 'Time',
            subTitle: message,
            buttons: [{
                text: 'OK',
                handler: () => {
                    console.log('OK clicked');
                    // this.navCtrl.pop();
                }
            }]
        });

        if (message.length != 0) {
            alert.present();
        }

    }

    changeDate() {
        console.log(this.todayInsertData._dateNow);
        let _fullDateww = this.todayInsertData._dateNow.substring(5, 7) + "/" + this.todayInsertData._dateNow.substring(8, 10) + "/" + this.todayInsertData._dateNow.substring(0, 4);
        console.log(_fullDateww);
        // displayFormat="DDDD MMM D, YYYY" pickerFormat="DDDD MMM D YYYY"
    }

    ionViewDidLoad() {
        this.loadProjectDetails();
        console.log('ionViewDidLoad TodayInputPage');

        // EmailComposer.isAvailable().then((available: boolean) => {
        //     if (available) {
        //         //Now we know we can send
        //         alert("Available");
        //     } else {
        //         // alert("Not available");
        //
        //     }
        // });
    }

    loadProjectDetails() {
        this.auth.loadProjectDetails()
            .then(data => {
                this.projectDetails = data;
            });
    }

    todayInsert() {

        if (this.canEdit) {
            var alertMessage = '';
            if (this.viewOrEdit) {
                alertMessage = 'Data updated sucessfully.';
            } else {
                alertMessage = 'Data inserted sucessfully.';
            }
            console.log('TodayInputPage : ', this.todayInsertData);

            this.todayInsertData._dateNow = this.todayInsertData._dateNow.substring(5, 7) + "/" + this.todayInsertData._dateNow.substring(8, 10) + "/" + this.todayInsertData._dateNow.substring(0, 4);

            let alert = this.alertCtrl.create({
                title: 'Time Sheet',
                subTitle: alertMessage,
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }]
            });

            let _day = {
                date: this.todayInsertData._dateNow,
                endTime: this.todayInsertData._timeEnds,
                projectName: this.todayInsertData._projectName,
                startTime: this.todayInsertData._timeStarts,
                taskDescription: this.todayInsertData._taskDescription,
                totalHours: this.todayInsertData._timeDiff
            };

            if (this.viewOrEdit) {

                for (let k = 0; k < this.assetCollection.length; k++) {

                    if (this.assetCollection[k].date === this.navParams.data.date &&
                        this.assetCollection[k].endTime === this.navParams.data.endTime &&
                        this.assetCollection[k].projectName === this.navParams.data.projectName &&
                        this.assetCollection[k].startTime === this.navParams.data.startTime &&
                        this.assetCollection[k].taskDescription === this.navParams.data.taskDescription &&
                        this.assetCollection[k].totalHours === this.navParams.data.totalHours) {
                        firebase.database().ref('today').child(this.assetCollection[k].id).update(_day);
                        break;
                    }

                }

            } else {
                firebase.database().ref('today').child(this.assetCollection.length).set(_day);
            }

            alert.present();
        } else {
            this.canEdit = true;
        }
    }

    changeProject($event, pName) {
        this.todayInsertData._projectName = pName;
        this.viewOrEdit = false;
    }

    ngAfterViewInit() {

    }

}
