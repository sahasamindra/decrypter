import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';

const { PushNotifications } = Plugins;// destructuring the plugins object and just taking the PushNotifications property
const { platform } = Capacitor;


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor() { }

  initPush() {
    this.registerPush();
  }

  registerPush() {
    console.log("request permission");
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    console.log("registration listener");
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        alert('Push registration success, token: ' + token.value);
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
