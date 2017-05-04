import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-project-master',
  templateUrl: 'project-master.html'
})
export class ProjectMasterPage {

  public projectDetails: any;
  _projectDetails = {
    commonFlag: false,
    projectCode: '',
    projectName: ''
  }

  public viewOrEdit: boolean = false;
  public canEdit: boolean = false;
  myIcon: string = "";

  currentSelected: any;

  constructor(public navCtrl: NavController,
    public auth: AuthService,
    public navParams: NavParams) {
    this.projectDetails = null;
    // this._projectDetails = null;
  }

  ngAfterViewInit() {
    this.loadProjectDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectMasterPage');
  }

  loadProjectDetails() {
    this.auth.loadProjectDetails()
      .then(data => {
        this.projectDetails = data;
        this.pos(0);
      });
  }

  pos(item) {
    this.currentSelected = item;
    this._projectDetails = this.projectDetails[item];
    console.log('pos: ', item);
  }

  changeFlag() {

  }

  assignDelete() {

  }

  assignUpdate() {

  }

}
