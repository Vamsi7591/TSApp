import { Component } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController, Loading, NavParams } from 'ionic-angular';
import { Network, StatusBar, NativePageTransitions, NativeTransitionOptions, Diagnostic, Device } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { AuthService } from '../../providers/auth-service';
import { UserSettings } from '../../providers/user-settings';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

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

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loading: Loading;
    registerCredentials = { employeeCode: 'e007', password: '12345' };
    userCredentials: User;
    flag: boolean = false;
    useObj: any;
    localStorage: any;

    constructor(public nav: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public network: Network,
        public alertCtrl: AlertController,
        public auth: AuthService,
        public userSettings: UserSettings,
        public storage: Storage,
        public loadingCtrl: LoadingController) {

        this.platform.ready().then(() => {
            this.localStorage = window.localStorage;
        });

        let options: NativeTransitionOptions = {
            direction: 'up',
            duration: 1500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 1500,
            winphonedelay: 250,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };

        NativePageTransitions.flip(options);
        // .then(onSuccess);
        // .catch(onError);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');

        StatusBar.overlaysWebView(true); // let status bar overlay webview

        StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white

        this.checkNetwork();

        // this.userSettings.isLoggedIn('user').then(userObj => this.flag = userObj);
    }

    ionViewDidEnter() {

        console.log('ionViewDidEnter : ' + this.userCredentials);

        // console.log('Device UUID is: ' + Device.uuid);
        // console.log('Device Platform is: ' + Device.platform);
        // alert('Device Platform is: ' + Device.platform);

        // Check an prompt runtime permissions
        // let successCallback = (isAvailable) => {
        //   console.log('Is available? ' + isAvailable);
        //   // alert('Is available : ' + isAvailable);
        // };
        // let errorCallback = (e) => {
        //   console.error(e);
        //   alert('Error : ' + e);
        // };
        //
        // if (this.platform.is('android')) {
        //   Diagnostic.requestCameraAuthorization().then(successCallback).catch(errorCallback);
        // }

        /**
        Add plugin first :  ionic plugin add cordova-plugin-geolocation

        Next check the permission like below:
        Diagnostic.requestLocationAuthorization().then(successCallback).catch(errorCallback);

        Callbacks for the permission :

        let successCallback = (isAvailable) => {
            console.log('Is available? ' + isAvailable);
            alert('Is available : ' + isAvailable);
        };
        let errorCallback = (e) => {
            console.error(e);
            alert('Error : ' + e);
        };



        Way 1 :
        Diagnostic.switchToSettings().then(successCallback).catch(errorCallback);

        Way 2 :
        Diagnostic.requestLocationAuthorization().then(successCallback).catch(errorCallback);

        Way 3 :
        Diagnostic.requestCameraAuthorization().then(successCallback, errorCallback);

        Way 4 :
        Diagnostic.getBluetoothState()
          .then((state) => {
            if (state == Diagnostic.bluetoothState.POWERED_ON) {
              // do something
              console.log(' POWERED_ON ');
              alert('state : ' + state);
            } else {
              // do something else
              console.log('  ', state);
              alert('state : ' + state);
            }
          }).catch(e => {
            console.error(e)
            alert('Error : ' + e);
          });
        **/
    }

    public createAccount() {
        this.registerCredentials = { employeeCode: '', password: '' };
        this.nav.push(RegisterPage);
    }

    public login() {
        this.showLoading()
        if (Network.type === "none") {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Network status',
                subTitle: "\n No internet connection !",
                buttons: ["OK"]
            });
            alert.present(prompt);
        } else {
            this.auth.login(this.registerCredentials).subscribe(allowed => {
                if (allowed) {
                    setTimeout(() => {
                        this.loading.dismiss();
                        // set a key/value
                        // this.storage.set('user', this.registerCredentials);
                        let credentials = this.auth.getUserInfo();

                        this.localStorage.setItem('role', credentials.role);

                        this.userSettings.userLoggedIn(
                            credentials.employeeCode,
                            credentials.password,
                            credentials.role
                        );

                        // this.dataService.save(credentials);

                        this.nav.setRoot(HomePage, credentials);
                    });
                } else {
                    this.showError("Access Denied");
                }
            },
                error => {
                    this.showError(error);
                });
        }
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    }

    checkNetwork() {
        if (Network.type === "none") {

            let alert = this.alertCtrl.create({
                title: 'Network status',
                subTitle: "\n No internet connection !",
                buttons: ["OK"]
            });
            alert.present(prompt);
        } else {
            // this.userSettings.getAllUsers().then(users => this.userCredentials = users);
        }
    }

}
