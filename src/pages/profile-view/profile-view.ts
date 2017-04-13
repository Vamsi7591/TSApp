import { Component, ChangeDetectionStrategy, Input, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import {
    ImagePicker,
    Camera,
    Device,
    Crop,
    Keyboard,
    Screenshot,
    BarcodeScanner
} from 'ionic-native';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { BrowserTab } from '@ionic-native/browser-tab';
import { CallNumber } from '@ionic-native/call-number';

import { PasswordPage } from '../password/password';
import { LoginPage } from '../login/login';
import { MapsPage } from '../maps/maps';
import { GoogleMapsPage } from '../google-maps/google-maps';


import { UserSettings } from '../../providers/user-settings';

import * as firebase from 'firebase';

declare var window: any;

@Component({
    selector: 'page-profile-view',
    templateUrl: 'profile-view.html',
    providers: [SpinnerDialog, BrowserTab, CallNumber]
})
export class ProfileViewPage {

    @ViewChild('employeeNameInput') employeeNameInput;
    @ViewChild('employeeCodeInput') employeeCodeInput;
    @ViewChild('emailIdInput') emailIdInput;
    @ViewChild('designationInput') designationInput;
    @ViewChild('mobileInput') mobileInput;
    @ViewChild('bloodGroupInput') bloodGroupInput;

    empInfo = {
        employeeName: '',//'Suresh Reddy',
        employeeCode: '',//'e008',
        emailId: '',//'suresh@wilcosource.com',
        designation: '',//'Technical Architect',
        mobile: '',//'+15109435983',
        bloodGroup: '',//'O +ve',
    };

    slideOneForm: FormGroup;
    slideTwoForm: FormGroup;
    submitAttempt: boolean = false;

    assetCollection;
    userAuth: any

    empCode: any = 'e007';

    lastImage: string = null;
    images: Array<{ src: string }>;
    selPic: any = 'assets/icon/logo.png';

    changePassword: boolean = false;

    public base64Image: any = 'assets/icon/user_icon.png';

    deviceId: string = '';
    hideDevice = false;
    platformIcon: any;

    localStorage: any;

    constructor(public navCtrl: NavController,
        private _zone: NgZone,
        private http: Http,
        private _platform: Platform,
        public userSettings: UserSettings,
        private alertCtrl: AlertController,
        public _actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController,
        private _viewController: ViewController,
        private spinnerDialog: SpinnerDialog,
        public formBuilder: FormBuilder,
        private browserTab: BrowserTab,
        private callNumber: CallNumber,
        public keyboard: Keyboard,
        public navParams: NavParams) {


        if (this._platform.is('android')) {
            this.platformIcon = 'logo-android';
        } else if (this._platform.is('ios')) {
            this.platformIcon = 'logo-apple';
        } else if (this._platform.is('windows')) {
            this.platformIcon = 'logo-windows';
        } else {
            this.hideDevice = true;
            this.platformIcon = 'browsers';
        }


        this.slideOneForm = this.formBuilder.group({
            employeeName: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            employeeCode: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            emailId: ['', Validators.compose([Validators.required, this.emailValidator])],
            designation: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            mobile: ['', Validators.compose([Validators.minLength(9), Validators.maxLength(11), Validators.pattern('[0-9 ]*'), Validators.required])],
            bloodGroup: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(10), Validators.pattern('[a-zA-Z ()+-]*'), Validators.required])]
        });


        this._platform.ready().then(() => {

            //show the keyboard accessory bar with the next, previous and done buttons
            Keyboard.hideKeyboardAccessoryBar(false);

            this.localStorage = window.localStorage;

            if (this.localStorage.getItem('userInfo') != null) {
                this.empInfo = JSON.parse(this.localStorage.getItem('userInfo'));
                this.submitAttempt = true;
            }

        });
    }

    emailValidator(control) {
        var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value);

        if (!EMAIL_REGEXP) {
            return { invalidEmail: true };
        }
    }

    formClick(value) {
        this.submitAttempt = true;
        // if (this.submitAttempt) {
        //     this.submitAttempt = false;
        // } else {
        //     this.submitAttempt = true;
        // }
        console.log(JSON.stringify(value));

        this.localStorage.setItem('userInfo', JSON.stringify(value));
        Keyboard.close();
    }

    takeScreenShot() {
        // Take a screenshot and save to file
        Screenshot.save('jpg', 100, new Date().getTime() + '_screenshot.jpg');
    }

    aboutUs() {
        this.browserTab.isAvailable().then((isAvailable: boolean) => {
            if (isAvailable) {
                this.browserTab.openUrl('http://www.wilcosource.com/page-about-us.html');
            } else {
                // open URL with InAppBrowser instead or SafariViewController
            }
        });
    }

    makeCall() {
        this.callNumber.callNumber('+919177777591', true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }

    navToChangePassword() {
        if (this.changePassword) {
            this.navCtrl.push(PasswordPage);
        }
    }

    navToMaps() {
        this._zone.run(() => {
            if (this._platform.is('android')) {
                this.navCtrl.push(MapsPage);
            } else {
                this.navCtrl.push(GoogleMapsPage);
            }
        });
    }

    getDeviceId() {
        this.deviceId = Device.uuid;
    }

    openBarcodeScanner() {
        BarcodeScanner.scan().then((barcodeData) => {

            if (barcodeData.cancelled) {
                console.log("User cancelled the action!");
                return false;
            }

            // Success! Barcode data is here
            // alert('Data : ' + JSON.parse(barcodeData));
            this.showAlert('Result', barcodeData.text);

        }, (err) => {
            // An error occurred
            this.showAlert('Error', err);

        });
    }

    moveNext(val, v) {
        if (val.keyCode == 9 || val.keyCode == 13) {
            if (v == "employeeName") {
                this.employeeCodeInput.setFocus();
            } else if (v == "employeeCode") {
                this.emailIdInput.setFocus();
            } else if (v == "emailId") {
                this.designationInput.setFocus();
            } else if (v == "designation") {
                this.mobileInput.setFocus();
            } else if (v == "mobile") {
                this.bloodGroupInput.setFocus();
            } else if (v == "bloodGroup") {
                if (this._platform.is('ios')) {
                    Keyboard.disableScroll(true);
                } else {
                    if (val.keyCode == 13) {
                        Keyboard.close();
                    }
                }
            }
        }
    }

    logOut() {
        this.userSettings.userLoggedOut();
        this.localStorage.removeItem('userInfo');
        this.localStorage.removeItem('role');
        this.navCtrl.parent.parent.setRoot(LoginPage);
    }

    ionViewWillLeave() {
        console.log(' ionViewWillLeave');
    }

    ionViewWillUnload() {
        console.log('ionViewWillUnload');
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter');
        this.changePassword = false;
    }

    openGallery() {
        let options = {
            maximumImagesCount: 1,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            // width: 250,
            // height: 250,
            quality: 100
        };

        ImagePicker.getPictures(options)
            .then((results) => {
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    // this.selPic = 'data:image/jpeg;base64,' + results[i];
                    this.base64Image = results[i];
                }
            }, (error) => {
                console.log("ERROR -> " + JSON.stringify(error));
            });
    }

    openCamera() {

        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            // encodingType: Camera.EncodingType.PNG,
            // targetWidth: 250,
            // targetHeight: 250,
            saveToPhotoAlbum: false,
            correctOrientation: false,
            cameraDirection: Camera.Direction.FRONT
        };

        Camera.getPicture(options).then((imageData) => {
            this._zone.run(() => {
                this.base64Image = imageData;
                //"data:image/jpeg;base64," +
            });
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error));
        });
    }

    openResizer(path) {

        if (this._platform.is('android')) {
            // alert(' android ');

            // if (Device.platform.toString().toLowerCase().match('android')) {

            Crop.crop(path, { quality: 100 })
                .then(
                newImage => {
                    console.log("new image path is: " + newImage)
                    // alert('FilePath : ' + newImage);
                    this.base64Image = newImage;
                },
                error => {
                    console.error("Error cropping image", error)
                    // alert('Error occured : ' + error.toString());
                    return path;
                });
            // }
        } else if (this._platform.is('ios')) {
            // alert(' iOS ');
            return path;
        } else if (this._platform.is('windows')) {
            // alert(' Windows ');
            return path;
        } else {
            // alert(' Other ');
            return path;
        }
    }

    presentActionSheet() {
        let actionSheet = this._actionSheetCtrl.create({
            title: 'Modify your profile picture',
            buttons: [
                {
                    text: 'Camera',
                    role: 'camera',
                    handler: () => {
                        console.log('Camera clicked');
                        // this.openCamera();
                        this.doGetPicture(true);
                    }
                },
                {
                    text: 'Gallery',
                    role: 'gallery',
                    handler: () => {
                        console.log('Gallery clicked');
                        // this.openGallery();
                        this.doGetPicture(false);
                        // this.doGetPicture(false);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    trackByFunction(index, item) {
        return item.id
    }

    /**
     * here we will initialize the component
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfileViewPage');
        console.log(Device)
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();

        // we will use anonymous auth for this example
        firebase.auth().signInWithEmailAndPassword('vamsik@prisaminfotech.com', 'password')
            .then((_auth) => {
                // when authenticated... alert the user
                console.log('login success');

                this.userAuth = _auth;
                this._zone.run(() => {
                    this.loadData();
                    loading.dismiss();
                });

            })
            .catch((error: Error) => {
                // Handle Errors here.
                loading.dismiss();
                var errorMessage = error.message;
                this.showAlert('Error', errorMessage);
            });
    }


    /**
       * called after the user has logged in to load up the data
       */
    loadData() {
        var result = [];
        // load data from firebase...
        firebase.database().ref('employeeProfile').orderByKey().once('value', (_snapshot: any) => {

            _snapshot.forEach((_childSnapshot) => {
                // get the key/id and the data for display
                var element = _childSnapshot.val();
                element.id = _childSnapshot.key;

                this.base64Image = element.url;
                result.push(element);
            });

            this.assetCollection = result;

        });
    }

    makeFileIntoBlob(_imagePath) {

        // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

                fileEntry.file((resFile) => {

                    var reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
                        imgBlob.name = '.jpg';
                        resolve(imgBlob);
                    };

                    reader.onerror = (e) => {
                        console.log('Failed file read: ' + e.toString().toLowerCase());
                        reject(e);
                    };

                    reader.readAsArrayBuffer(resFile);
                });
            });
        });
    }

    uploadToFirebase(_imageBlob) {
        var fileName = this.empCode + '.jpg';
        // var fileName = 'sample-' + new Date().getTime() + '.jpg';

        return new Promise((resolve, reject) => {
            var fileRef = firebase.storage().ref('profile_image/' + fileName);

            var uploadTask = fileRef.put(_imageBlob);

            uploadTask.on('state_changed', (_snapshot) => {
                console.log('snapshot progess ' + _snapshot);
            }, (_error) => {
                reject(_error);
            }, () => {
                // completion...
                resolve(uploadTask.snapshot);
            });
        });
    }

    saveToDatabaseAssetList(_uploadSnapshot) {
        var ref = firebase.database().ref('employeeProfile');

        return new Promise((resolve, reject) => {

            // we will save meta data of image in database
            var dataToSave = {
                'url': _uploadSnapshot.downloadURL, // url to access file
                // 'name': _uploadSnapshot.metadata.name, // name of the file
                // 'owner': firebase.auth().currentUser.uid,
                // 'email': firebase.auth().currentUser.email,
                'lastUpdated': new Date().getTime()
            };

            ref.child(this.empCode).update(dataToSave, (_response) => {
                resolve(_response);
            }).catch((_error) => {
                reject(_error);
            });

        });

    }

    doGetPicture(flag) {

        // let loading = this.loadingCtrl.create({
        //     spinner: 'hide',
        //     content: 'Please wait uploading ...'
        // });

        // TODO:
        // get picture from camera

        if (flag) {
            // Camera
            console.log(Device)
            // let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);

            Camera.getPicture({
                quality: 100,
                saveToPhotoAlbum: true,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                // targetHeight: 640,
                allowEdit: true,
                correctOrientation: false
            }).then((_croppedImage) => {
                //alert('got image ' + _croppedImage);
                // convert picture to blob

                if (this._platform.is('ios')) {
                    //'data:image/jpeg;base64,'+
                    this.base64Image = _croppedImage;
                } else if (this._platform.is('android')) {
                    this.base64Image = _croppedImage;
                } else {
                    this.base64Image = _croppedImage;
                }


                // loading.present();
                this.spinnerDialog.show('', 'Please wait uploading ...', true);
                return this.makeFileIntoBlob(this.base64Image);
            }).then((_imageBlob) => {
                //alert('got image blob ' + _imageBlob);

                // upload the blob
                return this.uploadToFirebase(_imageBlob);
            }).then((_uploadSnapshot: any) => {
                // alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);

                // store reference to storage in database
                return this.saveToDatabaseAssetList(_uploadSnapshot);

            }).then((_uploadSnapshot: any) => {
                // loading.dismiss();
                this.spinnerDialog.hide();
                this.showAlert('', 'File uploaded successfully.');
                // this.ionViewDidLoad();
            }, (_error) => {
                // loading.dismiss();
                this.spinnerDialog.hide();
                this.showAlert('Error', (_error.message || _error));
            });
        } else {
            // Gallery
            let optionsGallery = {
                maximumImagesCount: 1,
                // allowEdit: true,
                // saveToPhotoAlbum: true,
                // sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                quality: 100
            };

            ImagePicker.getPictures(optionsGallery)
                .then((results) => {

                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);

                        return this.base64Image = results[i];
                    }
                }
                , (error) => {
                    console.log("ERROR -> " + JSON.stringify(error));
                    // alert('ERROR occured : ' + error.toString());
                })
                .then((_img) => {
                    //
                    if (this._platform.is('ios')) {
                        //'data:image/jpeg;base64,'+
                        return Crop.crop(_img, { quality: 100 });
                    } else if (this._platform.is('android')) {
                        _img = 'file://' + _img;
                        return Crop.crop(_img, { quality: 100 });
                    } else {
                        return _img;
                    }
                })
                .then((_imagePath) => {
                    // alert('got image path ' + _imagePath);
                    // this.base64Image = _imagePath;

                    // convert picture to blob
                    // loading.present();
                    this.spinnerDialog.show('', 'Please wait uploading ...', true);
                    return this.makeFileIntoBlob(_imagePath);
                })
                .then((_imageBlob) => {
                    // alert('got image blob ' + _imageBlob);

                    // upload the blob
                    return this.uploadToFirebase(_imageBlob);
                }).then((_uploadSnapshot: any) => {
                    // alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);

                    // store reference to storage in database
                    return this.saveToDatabaseAssetList(_uploadSnapshot);
                }).then((_uploadSnapshot: any) => {
                    // loading.dismiss();
                    this.spinnerDialog.hide();
                    this.showAlert('', 'File uploaded successfully.');
                    // this.ionViewDidLoad();
                }, (_error) => {
                    // loading.dismiss();
                    this.spinnerDialog.hide();
                    // alert('Error ' + (_error.message || _error));
                    // this.showAlert('', (_error.message || _error));
                });
        }
    }

    presentConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Crop image',
            message: 'Do you want to crop this image?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Buy clicked');
                        this.openResizer(this.base64Image);
                    }
                }
            ]
        });
        alert.present();
    }

    showAlert(_title, _message) {
        let alert = this.alertCtrl.create({
            title: _title,
            message: _message,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.ionViewDidLoad();
                }
            }]
        });
        alert.present()
    }
}

@Component({
    selector: "item-component",
    template: `
      <p>Emp Code : {{item.id}}</p>
      <ion-avatar>
      <img [src]=item.url class="padding"/>
      </ion-avatar>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {

    @Input() item: any;

    constructor() {
        // <p>Emp Code : {{item.name}}</p>
        // <p>{{item.email}}</p>
    }
}
