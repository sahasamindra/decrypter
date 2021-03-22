import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async presentToast(message, duration, position, cssClass, icon) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
      keyboardClose: true,
      cssClass: cssClass,
      buttons: [
        {
          side: 'end',
          icon: icon
        }
      ]
    });
    toast.present();
  }

}
