import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service';
import {
    Geolocation,
    NativeGeocoder,
    NativeGeocoderReverseResult
} from 'ionic-native';

declare var google;

@Component({
    selector: 'page-google-maps',
    templateUrl: 'google-maps.html'
    // providers: [Geolocation]
})
export class GoogleMapsPage {

    @ViewChild('map') mapElement: ElementRef;

    map: any;
    mapInitialised: boolean = false;
    apiKey: any;

    ngr_result = {
        houseNumber: '',
        street: '',
        city: '',
        postalCode: '',
        countryName: '',
        countryCode: ''
    };

    constructor(
        public navCtrl: NavController,
        public platform: Platform,
        private _zone: NgZone,
        public connectivityService: ConnectivityService,
        public geolocation: Geolocation) {

        this.apiKey = "AIzaSyCZEKAe-Nw_FQzNmWEXe6BgtcqD4CQw0Mw";
        // if(this.platform.is('android')){
        //   // Android
        //   this.apiKey  = "AIzaSyDsKR-DzJJuYHwOy-ebrtBIYfSpXtz5B0Y";
        // }else if(this.platform.is('ios')){
        //   // iOS
        //   this.apiKey  = "AIzaSyC_Lfh7BxqgeQV2blgHs_iGwpqUBsgx-zM";
        // }
        this._zone.run(() => {
            this.loadGoogleMaps();
        });

    }

    loadGoogleMaps() {

        this.addConnectivityListeners();

        if (typeof google == "undefined" || typeof google.maps == "undefined") {

            console.log("Google maps JavaScript needs to be loaded.");
            this.disableMap();

            if (this.connectivityService.isOnline()) {
                console.log("online, loading map");

                //Load the SDK
                window['mapInit'] = () => {
                    this.initMap();
                    this.enableMap();
                }

                let script = document.createElement("script");
                script.id = "googleMaps";

                if (this.apiKey) {
                    script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
                } else {
                    script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
                }

                document.body.appendChild(script);

            }
        }
        else {

            if (this.connectivityService.isOnline()) {
                console.log("showing map");
                this.initMap();
                this.enableMap();
            }
            else {
                console.log("disabling map");
                this.disableMap();
            }

        }

    }

    initMap() {

        this.mapInitialised = true;

        Geolocation.getCurrentPosition().then((position) => {

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });

            var addr = 'Your current location.';

            this._zone.run(() => {
                NativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude)
                    .then((result: NativeGeocoderReverseResult) => {

                        this.ngr_result = result;
                        // alert(JSON.stringify(this.ngr_result));

                        addr = 'Address: ';
                        if (this.ngr_result.houseNumber) {
                            addr = addr + this.ngr_result.houseNumber + ', ';
                        }

                        if (this.ngr_result.street) {
                            addr = addr + this.ngr_result.street + ', ';
                        }

                        if (this.ngr_result.city) {
                            addr = addr + this.ngr_result.city;
                        }

                        if (this.ngr_result.postalCode) {
                            addr = addr + ' - ' + this.ngr_result.postalCode + ', ';
                        }

                        if (this.ngr_result.countryName) {
                            addr = addr + this.ngr_result.countryName + '.';
                        }

                        // alert(addr);
                        this.addInfoWindow(marker, addr);//content

                        // console.log("The address is\n " + result.city + " in " + result.countryName);
                    })
                    .catch((error: any) => {
                        // console.log(error);
                        alert(error);
                    });
            });

            // let content = "<p>Your location!</p>";


        });



    }

    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    disableMap() {
        console.log("disable map");
    }

    enableMap() {
        console.log("enable map");
    }

    addConnectivityListeners() {

        let onOnline = () => {

            setTimeout(() => {
                if (typeof google == "undefined" || typeof google.maps == "undefined") {

                    this.loadGoogleMaps();

                } else {

                    if (!this.mapInitialised) {
                        this.initMap();
                    }

                    this.enableMap();
                }
            }, 2000);

        };

        let onOffline = () => {
            this.apiKey = '';
            this.disableMap();
        };

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }

    // ionViewDidLoad(){
    //   // this.loadMap();
    // }
    //
    // ngOnInit(){
    //   this.loadMap();
    // }
    //
    // loadMap(){
    //
    //   this.geolocation.getCurrentPosition().then((position) => {
    //
    //     let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //
    //     let mapOptions = {
    //       center: latLng,
    //       zoom: 15,
    //       mapTypeId: google.maps.MapTypeId.ROADMAP
    //     }
    //
    //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //
    //   }, (err) => {
    //     console.log(err);
    //   });
    //
    // }

}
