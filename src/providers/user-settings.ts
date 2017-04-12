import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite } from 'ionic-native';
import { SqlStorage } from './sql-storage';

const win: any = window;

@Injectable()
export class UserSettings {

    public db: SQLite;
    public sql: SqlStorage;

    constructor(public events: Events, public storage: Storage) {
        if (win.sqlitePlugin) {//localStorage
            this.sql = new SqlStorage();
        } else {
            console.warn('SQLite plugin not installed. Falling back to regular Ionic Storage.');
        }
    }

    userLoggedIn(employeeCode, password, role): void {
        let item = { employeeCode: employeeCode, password: password, role: role };
        this.storage.set('user', JSON.stringify(item));
    };

    // userLoggedIn(employeeCode, password, role) {
    //     let item = { employeeCode: employeeCode, password: password, role: role };
    //
    //     if (this.sql) {
    //         this.sql.set('user', JSON.stringify(item)).then(data => {
    //             // this.events.publish('userObj:changed');
    //         });
    //     } else {
    //         return new Promise(resolve => {
    //             this.storage.set('user', JSON.stringify(item)).then(() => {
    //                 // this.events.publish('userObj:changed');
    //                 resolve();
    //             });
    //         });
    //     }
    // }

    userLoggedOut(): void {
        this.storage.remove('user');
        // this.events.publish('user:logout');
    };

    // userLoggedOut() {
    //     if (this.sql) {
    //         this.sql.remove('user').then(data => {
    //             // this.events.publish('userObj:changed');
    //         });
    //     } else {
    //         return new Promise(resolve => {
    //             this.storage.remove('user').then(() => {
    //                 // this.events.publish('userObj:changed');
    //                 resolve();
    //             });
    //         });
    //     }
    // }

    getAllUsers() {
        if (this.sql) {
            return this.sql.getAll();
        } else {
            return new Promise(resolve => {
                let results = [];
                this.storage.forEach(data => {
                    results.push(JSON.parse(data));
                });
                return resolve(results);
            });
        }
    }

    getUser(): Promise<string> {
        return this.storage.get('user').then((value) => {
            return value;
        });
    };

    // getUser() {
    //     if (this.sql) {
    //         return this.sql.get('user');
    //     } else {
    //         return new Promise(resolve => resolve(this.storage.get('user')));
    //     }
    // }

    isLoggedIn(user) {

        if (this.sql) {
            return this.sql.get(user.toString()).then(value => value ? true : false);
        } else {
            return new Promise(resolve => resolve(this.storage.get(user.toString()).then(value => value ? true : false)));
        }
    }

    initStorage() {
        if (this.sql) {
            return this.sql.initializeDatabase();
        } else {
            return new Promise(resolve => resolve());
        }
    }

}
