import { firebaseConfig } from './firebase.config';

import { Component, ViewChild } from '@angular/core';
import { Events, LoadingController, Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';//Push
import { Storage } from '@ionic/storage';

// import { LoadingPage } from '../pages/loading/loading';
import { TodayPage } from '../pages/today/today'
import { LoginPage } from '../pages/login/login';
import { EmployeeMasterPage } from '../pages/employee-master/employee-master'
import { EmployeeProjectPage } from '../pages/employee-project/employee-project'
import { ProjectMasterPage } from '../pages/project-master/project-master'
import { SummaryDetailsPage } from '../pages/summary-details/summary-details'
import { HomePage } from '../pages/home/home'

import { UserSettings } from '../providers/user-settings';

import * as firebase from 'firebase';

@Component({
    selector: 'app',
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    pages: Array<{ title: string, component: any }>;
    userCredentials: any;
    disconnectSubscription: any;
    connectSubscription: any;

    activePage: any;

    constructor(public events: Events,
        public loadingController: LoadingController,
        public alertCtrl: AlertController,
        public platform: Platform,
        public storage: Storage,
        public userSettings: UserSettings) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {

            // StatusBar.styleDefault();
            StatusBar.overlaysWebView(true); // let status bar overlay webview

            StatusBar.backgroundColorByHexString('#00000'); // set status bar to white
            Splashscreen.hide();

            // -------------- OneSingal ------------------//
            // Enable to debug issues.
            // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

            // var notificationOpenedCallback = function(jsonData) {
            //     console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            // };
            //
            // window["plugins"].OneSignal
            //     .startInit("d7a8226b-6b7a-4862-9f39-e166f0d5b3f6", "809455974981")
            //     .handleNotificationOpened(notificationOpenedCallback)
            //     .endInit();
            // -------------- OneSingal ------------------//


            // -------------- Firebase ------------------//
            // this.initPushNotification();
            // -------------- Firebase ------------------//

            this.userSettings.initStorage().then(() => {

                // this.events.subscribe('favorites:changed', () => this.refreshFavorites());
            });
        });

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Time Sheet', component: TodayPage },
            { title: 'Employee Master', component: EmployeeMasterPage },
            { title: 'Project Master', component: ProjectMasterPage },
            { title: 'Employee Project', component: EmployeeProjectPage },
            { title: 'Summary Details', component: SummaryDetailsPage }
        ];

        this.activePage = this.pages[0];

        firebase.initializeApp(firebaseConfig);//,"TimeSheet"
    }


    loadExistingUser() {

        this.userSettings.getUser().then(users => {

            if (users) {

                this.userCredentials = JSON.parse(users);

                if (this.userCredentials != null) {
                    this.nav.setRoot(HomePage, this.userCredentials);
                }

            } else {
                this.rootPage = LoginPage;
            }

        });
        //this.favoriteTeams = this.userSettings.getAllFavorites();
    }

    checkActive(_page) {
        return _page == this.activePage;
    }

    openPage($event, page) {
        this.nav.setRoot(HomePage, page);
        this.activePage = page;
    }

    ngAfterViewInit() {
        this.storage.get('user').then((user: any) => {

            console.log('ngAfterViewInit : ', user);
            if (user != null) {

                this.userCredentials = JSON.parse(user);

                if (this.userCredentials != null) {
                    this.nav.setRoot(HomePage, this.userCredentials);
                }

            }
            else {
                this.rootPage = LoginPage;
            }
        });
    }

    // initPushNotification() {
    //   if (!this.platform.is('cordova')) {
    //     console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
    //     return;
    //   }
    //   let push = Push.init({
    //     android: {
    //       senderID: "809455974981"
    //     },
    //     ios: {
    //       alert: "true",
    //       badge: false,
    //       sound: "true"
    //     },
    //     windows: {}
    //   });
    //
    //   push.on('registration', (data) => {
    //     console.log("device token ->", data.registrationId);
    //     //TODO - send device token to server
    //   });
    //
    //   push.on('notification', (data) => {
    //     console.log('message', data.message);
    //     let self = this;
    //     //if user using app and push notification comes
    //     if (data.additionalData.foreground) {
    //       // if application open, show popup
    //       let confirmAlert = this.alertCtrl.create({
    //         title: 'New Notification',
    //         message: data.message,
    //         buttons: [{
    //           text: 'Ignore',
    //           role: 'cancel'
    //         }, {
    //             text: 'View',
    //             handler: () => {
    //               //TODO: Your logic here
    //               self.nav.push(LoginPage, { message: data.message });
    //             }
    //           }]
    //       });
    //       confirmAlert.present();
    //     } else {
    //       //if user NOT using app and push notification comes
    //       //TODO: Your logic on click of push notification directly
    //
    //       self.nav.push(LoginPage, { message: data.message });
    //       console.log("Push notification clicked");
    //     }
    //   });
    //   push.on('error', (e) => {
    //     console.log(e.message);
    //   });
    // }


    ionViewDidLoad() {

        this.checkNetwork();

    }

    checkNetwork() {

        // watch network for a disconnect
        this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
            // console.log('network was disconnected :-(');
            alert('network was disconnected :-(');
        });

        // watch network for a connection
        this.connectSubscription = Network.onConnect().subscribe(() => {
            console.log('network connected!'); 
            // We just got a connection but we need to wait briefly
            // before we determine the connection type.  Might need to wait 
            // prior to doing any api requests as well.
            setTimeout(() => {
                if (Network.type === 'unknown') {
                    alert('we got a unknown connection, woohoo :-)');
                } else if (Network.type === 'ethernet') {
                    alert('we got a ethernet connection, woohoo :-)');
                } else if (Network.type === 'wifi') {
                    alert('we got a wifi connection, woohoo :-)');
                } else if (Network.type === '2g') {
                    alert('we got a 2g connection, woohoo :-)');
                } else if (Network.type === '3g') {
                    alert('we got a 3g connection, woohoo :-)');
                } else if (Network.type === '4g') {
                    alert('we got a 4g connection, woohoo :-)');
                } else if (Network.type === 'cellular') {
                    alert('we got a cellular connection, woohoo :-)');
                } else if (Network.type === 'none') {
                    alert('we got a none connection, woohoo :-)');
                }

            }, 3000);
        });
    }

    removeSubscription() {
        // stop disconnect watch
        this.disconnectSubscription.unsubscribe();

        // stop connect watch
        this.connectSubscription.unsubscribe();
    }

}
