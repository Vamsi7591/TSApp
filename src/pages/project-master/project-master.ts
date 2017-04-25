import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-project-master',
  templateUrl: 'project-master.html'
})
export class ProjectMasterPage {

  public projectDetails: any;

  constructor(public navCtrl: NavController,
    public auth: AuthService,
    public navParams: NavParams) {
    this.projectDetails = null;
  }

  ionViewDidLoad() {
    this.loadProjectDetails();
    console.log('ionViewDidLoad ProjectMasterPage');
  }

  loadProjectDetails() {
    this.auth.loadProjectDetails()
      .then(data => {
        this.projectDetails = data;
      });
  }

  pos(item) {
    console.log('pos: ', item);
  }


}
