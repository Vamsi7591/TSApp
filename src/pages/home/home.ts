import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { StatusBar, LocalNotifications, Keyboard } from 'ionic-native';

import { AuthService } from '../../providers/auth-service';
import { UserSettings } from '../../providers/user-settings';

import { LoginPage } from '../login/login';
import { TodayPage } from '../today/today';
import { TodayInputPage } from '../today-input/today-input';
import { MonthlyPage } from '../monthly/monthly';
import { WeeklyPage } from '../weekly/weekly';
import { ProfileViewPage } from '../profile-view/profile-view';

import { EmployeeMasterPage } from '../employee-master/employee-master';
import { MyApp } from '../../app/app.component';

import * as moment from 'moment';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [Keyboard, LocalNotifications]
})
export class HomePage {
    employeeCode = '';
    password = '';
    info: any;
    sheet: any = HomePage;
    dayTab: any;
    weekTab: any = WeeklyPage;
    monthTab: any = MonthlyPage;
    passwordTab: any = ProfileViewPage;
    userCredentials: any[];
    selMenuItem: any;

    isFirstTime = true;

    notifyTime: any;
    notifications: any[] = [];
    days: any[];
    chosenHours: number;
    chosenMinutes: number;
    isAdmin: boolean = false;
    //valueforngif = true;

    constructor(
        public nav: NavController,
        public userSettings: UserSettings,
        public navParams: NavParams,
        public platform: Platform,
        private localNotifications: LocalNotifications,
        public alertCtrl: AlertController,
        public keyboard: Keyboard,
        private auth: AuthService) {

        StatusBar.overlaysWebView(true); // let status bar overlay webview

        StatusBar.backgroundColorByHexString('#000000');

        if (this.navParams.data.component != null) {
            this.selMenuItem = this.navParams.data.component;
            this.dayTab = this.selMenuItem;
        }
        else if (this.navParams.data.role === "admin") {
            // this.info = this.auth.getUserInfo();
            this.isAdmin = true;
            this.employeeCode = this.navParams.data.employeeCode;
            this.password = this.navParams.data.password;
            this.dayTab = TodayPage;//EmployeeMasterPage;


        } else if (this.navParams.data.role === "user") {
            // this.info = this.auth.getUserInfo();
            this.isAdmin = false;
            this.employeeCode = this.navParams.data.employeeCode;
            this.password = this.navParams.data.password;
            this.dayTab = TodayPage;


        } else {

            this.info = this.auth.getUserInfo();
            this.employeeCode = this.info.employeeCode;
            this.password = this.info.password;

            if (this.info.role === "admin") {
                this.isAdmin = true;
                this.dayTab = TodayPage;//EmployeeMasterPage;
            } else {
                this.isAdmin = false;
                this.dayTab = TodayPage;
            }
        }

        // LocalNotifications.on('click', (notification, state) => {
        //     this.dayTab = TodayInputPage;
        // });

        console.log('ionViewDidLoad HomePage', this.navParams.data);
        // this.userSettings.isLoggedIn('user').then(userObj => this.flag = userObj);

        this.notifyTime = moment(new Date()).format();

        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();

        this.days = [
            { title: 'Monday', dayCode: 1, checked: true },
            { title: 'Tuesday', dayCode: 2, checked: true },
            { title: 'Wednesday', dayCode: 3, checked: true },
            { title: 'Thursday', dayCode: 4, checked: true },
            { title: 'Friday', dayCode: 5, checked: true },
            { title: 'Saturday', dayCode: 6, checked: false },
            { title: 'Sunday', dayCode: 0, checked: false }
        ];

        this.addNotifications();
    }

    ionViewDidLoad() {
        MyApp.prototype.checkNetwork();
    }

    ionViewDidEnter() { }

    ionViewDidLeave() {
        MyApp.prototype.removeSubscription();
    }

    ngAfterViewInit() {
        // Schedule delayed notification
        // if (this.isFirstTime) {
        //     this.isFirstTime = false;
        //
        //     LocalNotifications.schedule({
        //         // title:this.employeeCode,
        //         text: 'Hi, Please fill today\'s timeshee t .',
        //         at: new Date(new Date().getTime() + 3600 * 10),
        //         // led: '673147',
        //         // sound: null,
        //         icon: 'assets/icon/logo.png',
        //         every: 'day'
        //     });
        // }
    }


    public logout() {
        this.auth.logout().subscribe(succ => {
            this.nav.parent.parent.setRoot(LoginPage)
        });
    }

    addNotifications() {

        let currentDate = new Date();
        let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

        // Morning 10 'O'clock
        for (let day of this.days) {

            if (day.checked) {

                let firstNotificationTime = new Date();
                let dayDifference = day.dayCode - currentDay;

                if (dayDifference < 0) {
                    dayDifference = dayDifference + 7; // for cases where the day is in the following week
                }

                if (dayDifference === 0) {
                    if (firstNotificationTime.getHours() <= 9) {
                        firstNotificationTime.setHours(10);
                    } else {
                        firstNotificationTime.setHours(10 + (24 * 8));
                    }
                } else {
                    firstNotificationTime.setHours(10 + (24 * (dayDifference)));//firstNotificationTime.getHours()
                }
                firstNotificationTime.setMinutes(0, 0, 0);

                // Testing
                // firstNotificationTime.setHours(firstNotificationTime.getHours());
                // firstNotificationTime.setMinutes(firstNotificationTime.getMinutes() + dayDifference, 0, 0);

                let notification = {
                    id: day.dayCode,
                    title: 'TimeSheet',
                    text: 'Hi, Please fill timesheet.',//today\'s
                    at: firstNotificationTime,
                    every: 'week',
                    icon: 'file://assets/icon/logo_wilco.png',
                    smallIcon: 'res://drawable-hdpi/loading_icon.png',
                    // color: 'FF0000'
                };

                this.notifications.push(notification);

            }

        }

        // Evening 6 'O'clock
        for (let day of this.days) {

            if (day.checked) {

                let firstNotificationTime = new Date();
                let dayDifference = day.dayCode - currentDay;

                if (dayDifference < 0) {
                    dayDifference = dayDifference + 7; // for cases where the day is in the following week
                }

                if (dayDifference === 0) {
                    if (firstNotificationTime.getHours() <= 17) {
                        firstNotificationTime.setHours(18);
                    } else {
                        firstNotificationTime.setHours(18 + (24 * 8));
                    }
                } else {
                    firstNotificationTime.setHours(18 + (24 * (dayDifference)));//firstNotificationTime.getHours()
                }
                firstNotificationTime.setMinutes(0, 0, 0);

                let notification = {
                    id: day.dayCode + 5,
                    title: 'TimeSheet',
                    text: 'Hi, Please fill timesheet.',//today\'s
                    at: firstNotificationTime,
                    every: 'week',
                    icon: 'file://assets/icon/logo_wilco.png',
                    smallIcon: 'res://drawable-hdpi/loading_icon.png'
                };

                this.notifications.push(notification);

            }

        }

        console.log("Notifications to be scheduled: ", this.notifications);

        LocalNotifications.registerPermission();

        // Cancel any existing notifications
        LocalNotifications.cancelAll().then(() => {

            // Schedule the new notifications
            LocalNotifications.schedule(this.notifications);

            this.notifications = [];

            // let alert = this.alertCtrl.create({
            //     title: 'Notifications set',
            //     buttons: ['Ok']
            // });
            //
            // alert.present();

        });

        // LocalNotifications.getAllTriggered().then((_gas) =>
        //     alert("getAllTriggered : " + _gas.length));
        // //
        // //
        // LocalNotifications.getAllScheduled().then((_gas) =>
        //     alert("getAllScheduled : " + _gas.length));
        //
        // LocalNotifications.getTriggeredIds().then((_gas) =>
        //     alert("getTriggeredIds : " + _gas.length));
        //
        //
        // LocalNotifications.getAllIds().then((_gas) => {
        //     alert("getAllIds : " + _gas.length);
        //     if (_gas.length === 0) {
        //         // Schedule the new notifications
        //         LocalNotifications.schedule(this.notifications);
        //     }
        // });
        //
        // LocalNotifications.isTriggered(1).then((_gas) =>
        //     alert(1 + " : isTriggered : " + _gas));
        //
        // LocalNotifications.isTriggered(5).then((_gas) =>
        //     alert(5 + " : isTriggered : " + _gas));
        //
        // //
        // LocalNotifications.getAll().then((_gas) =>
        //     alert("getAll : " + _gas));

        // LocalNotifications.on('trigger', this.check('trigger'));

        // LocalNotifications.on('click', (notification, state) => {
        //     // this.dayTab = TodayInputPage;
        //     // this.check('home');
        // });

        // LocalNotifications.on('trigger', (notification, state) => {
        //     this.dayTab = TodayInputPage;
        // });

        // LocalNotifications.on('schedule', this.check('schedule'));

    }

    check(val): void {
        alert(val);
    }

}
