import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { UserSettings } from '../../providers/user-settings';

import { LoginPage } from '../login/login';

@Component({
    selector: 'page-password',
    templateUrl: 'password.html'
})
export class PasswordPage {

    createSuccess = false;
    registerCredentials = { oldPass: '', newPass: '', conformPass: '' };

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public userSettings: UserSettings,
        private auth: AuthService) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordPage');
    }

    public goLogOut() {
        this.auth.logout().subscribe(succ => {
            this.userSettings.userLoggedOut();
            this.navCtrl.parent.parent.setRoot(LoginPage);
        });
    }

    changePassword() {
        this.navCtrl.parent.parent.setRoot(LoginPage);
    }

}
