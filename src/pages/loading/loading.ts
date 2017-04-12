import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-loading',
    templateUrl: 'loading.html'
})
export class LoadingPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoadingPage');
    }

}
