
import { Component, NgZone } from "@angular/core";
import { NavController, Platform } from 'ionic-angular';
import {
    GoogleMapsLatLng,
    GoogleMapsMarker,
    GoogleMapsMarkerOptions,
    Geolocation,
    NativeGeocoder,
    NativeGeocoderReverseResult
} from 'ionic-native';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Toast } from '@ionic-native/toast';

@Component({
    selector: 'page-maps',
    templateUrl: 'maps.html',
    providers: [LocationAccuracy, Toast,GoogleMaps]
})
export class MapsPage {

    private map: any;
    _latitude: any = 0;
    _longitude: any = 0;

    ngr_result = {
        houseNumber: '',
        street: '',
        city: '',
        postalCode: '',
        countryName: '',
        countryCode: ''
    };
    constructor(
        private _navController: NavController,
        private platform: Platform,
        private toast: Toast,
        private googleMaps: GoogleMaps,
        private locationAccuracy: LocationAccuracy,
        private _zone: NgZone) {

        this.platform.ready()
            .then(() => this.onPlatformReady());
    }

    private onPlatformReady(): void {
        console.log("onPlatformReady");

    }

    closeMap() {
        this._navController.pop();
    }

    ngAfterViewInit() {
        // Geolocation.getCurrentPosition().then((resp) => {
        //     this._latitude = resp.coords.latitude
        //     this._longitude = resp.coords.longitude
        // }).catch((error) => {
        //     console.log('Error getting location', error);
        // });

        // var subscription = Geolocation.watchPosition()
        //     .filter((p) => p.coords !== undefined) //Filter Out Errors
        //     .subscribe(position => {
        //         this._latitude = position.coords.latitude;
        //         this._longitude = position.coords.longitude;
        //         console.log(position.coords.longitude + ' ' + position.coords.latitude);
        //         alert(position.coords.longitude + ' ' + position.coords.latitude);
        //     });

        this._zone.run(() => {


            this.locationAccuracy.canRequest().then((canRequest: boolean) => {

                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                        .then(() => console.log('Request successful'),
                        error => console.log('Error requesting location permissions', error));
                }
            });

            this.map.isAvailable().then(() => {

              let element: HTMLElement = document.getElementById('map_canvas');

              let map: GoogleMap = this.googleMaps.create(element);

                // this.map = new GoogleMap('map_canvas', {
                //             'backgroundColor': 'white',
                //             'controls': {
                //               'compass': true,
                //               'myLocationButton': true,
                //               'indoorPicker': true,
                //               'zoom': true
                //             },
                //             'gestures': {
                //               'scroll': true,
                //               'tilt': true,
                //               'rotate': true,
                //               'zoom': true
                //             }
                //             // ,'camera': {
                //             //   'latLng': location,
                //             //   'tilt': 30,
                //             //   'zoom': 15,
                //             //   'bearing': 50
                //             // }
                //             });

                // this.map.clear();

                this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
                    // alert("GoogleMap.onMapReady(): " + JSON.stringify(data));

                    this._zone.run(() => {
                        // let myPosition = new GoogleMapsLatLng(this._latitude, this._longitude);//38.9072, -77.0369
                        // console.log("My position is", myPosition);
                        // this.map.animateCamera({ target: myPosition, zoom: 10 });
                        this.map.getMyLocation().then(res => {
                            console.log('Give it to me' + res.latLng);

                            // alert("GoogleMap.onMapReady(): " + JSON.stringify(res.latLng));
                            let myPosition = new GoogleMapsLatLng(res.latLng.lat, res.latLng.lng);

                            this.toast.show(res.latLng.lat + "," + res.latLng.lng, 'long', 'center').subscribe(
                                toast => {
                                    console.log(toast);
                                }
                            );

                            var addr = 'Your current location.';

                            NativeGeocoder.reverseGeocode(res.latLng.lat, res.latLng.lng).then((result: NativeGeocoderReverseResult) => {

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
                                // console.log("The address is\n " + result.city + " in " + result.countryName);
                            })
                                .catch((error: any) => {
                                    // console.log(error);
                                    alert(error);
                                });

                            this.map.animateCamera({ target: myPosition, zoom: 14, tilt: 30 });
                            this.map.refreshLayout();
                            this.map.addGroundOverlay(true);
                            this.map.setAllGesturesEnabled(true);
                            this.map.setDebuggable(true);

                            if (res.latLng.lat != 0) {

                                // let customMarker = "assets/icon/user_icon.png";
                                let markerOptions: GoogleMapsMarkerOptions = {
                                    position: myPosition,
                                    title: addr
                                    // icon: customMarker
                                };

                                this.map.addMarker(markerOptions).then((marker: GoogleMapsMarker) => {
                                    // marker.setDraggable(true);
                                    // infowindow.open(marker.get('map'), marker);

                                    marker.setTitle(addr);
                                    // if (addr != 'Your current location.') {
                                    //     marker.showInfoWindow();
                                    // }
                                });
                            } else {
                                this.toast.show('Please check your connection and retry.', 'long', 'center').subscribe(
                                    toast => {
                                        console.log(toast);
                                    }
                                );
                            }
                        });
                    });
                });
                this.map.setBackgroundColor("white");
                this.map.setMyLocationEnabled(true);
            });
        });
    }


    private onMapReady(): void {
        alert('Map ready');
        //this.map.setOptions(mapConfig);
    }
}
