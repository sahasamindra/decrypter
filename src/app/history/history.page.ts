import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { ToastService } from '../services/toast.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  cardElement = [];
  noData: boolean = false;

  constructor(public modalController: ModalController, private toast: ToastService) {
    this.getkeys();
  }

  async presentRegModal() {
    const modal = await this.modalController.create({
      component: RegisterPage
    });
    modal.onDidDismiss().then((dataReturned) => {
      let auth = dataReturned.data;
      if (auth !== undefined) this.setUser(auth);
    });
    return await modal.present();
  }

  async setUser(token) {
    // const ret = await Storage.get({ key: 'user-auth-token' });
    // if (ret.value == null || ret.value == '' || ret.value == undefined) {

    await Storage.set({ key: 'user-auth-token', value: token })
      .then(() => this.toast.presentToast('Success! Please remember your password', 3000, 'top', 'toast-success-class', 'checkmark-outline'))
      .catch(() => this.toast.presentToast('Password reset failed', 2000, 'bottom', 'toast-failed-class', 'close-outline'));

    // } else this.toast.presentToast('User already exist', 3000, 'bottom', 'toast-failed-class', 'close-outline');
  }

  ngOnInit() {
  }

  async getkeys() {
    const { keys } = await Storage.keys();
    if (keys.length > 1) {
      let filteredKeyList = [];
      filteredKeyList = keys.filter(key => {
        return key.substr(-4) == '_log';
      });
      if (filteredKeyList.length > 0) filteredKeyList.map(key => this.getObject(key));
      else this.noData = true;
      //  keys.map(key => this.getObject(key));
    } else this.noData = true;
  }

  async getObject(key) {
    const ret = await Storage.get({ key: key });
    const user = JSON.parse(ret.value);
    user.key = key;
    this.cardElement.push(user);
    // console.log(this.cardElement);
  }
}
