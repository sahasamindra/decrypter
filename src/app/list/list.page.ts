import { DataDetailService } from './../services/data/data-detail.service';
import { Component, OnInit } from '@angular/core';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';
import { ModalController } from '@ionic/angular';

const { Storage, Filesystem } = Plugins;

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  today = '';
  allItem = [];
  backupallItem = [];
  searchResultNull: boolean = false;
  noData: boolean = false;

  constructor(
    private toast: ToastService,
    public alertController: AlertController,
    private router: Router,
    private dataService: DataDetailService,
    public modalController: ModalController) {
    this.getkeys();
  }

  ngOnInit() {
  }

  detail(item) {
    this.dataService.setData(item.indicator, item);
    this.router.navigateByUrl('details/' + item.indicator);
  }

  async presentRegModal() {
    const modal = await this.modalController.create({
      component: HomePage
    });
    modal.onDidDismiss().then((dataReturned) => {
      let reload = dataReturned.data;
      if (reload) this.getkeys();
    });
    return await modal.present();
  }

  async fileWrite() {
    if (this.backupallItem.length == 0) return;
    let fileData = this.backupallItem.map((item, i) => {
      return ' \n' + (i + 1) + ')' + item.indicator + ' -> ' + item.encodedText;
    })
    console.log(this.backupallItem);
    console.log(fileData.toString());
    try {
      const result = await Filesystem.writeFile({
        path: 'info.txt',
        data: fileData.toString(),
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      this.toast.presentToast('File downloaded successfully', 2000, 'top', 'toast-success-class', 'code-download-outline')
      // console.log('Wrote file', result);
    } catch (e) {
      this.toast.presentToast('Download failed', 3000, 'bottom', 'toast-failed-class', 'close-outline');
      console.error('Unable to write file', e);
    }
  }


  search(ev) {
    // console.log(ev.detail.value);
    // if(ev.detail.value.trim() == '' || ev.detail.value.trim() == null) console.log('blank');

    this.allItem = this.backupallItem;
    this.searchResultNull = false;
    let val = ev.detail.value;

    if (!val || !val.trim()) {
      this.allItem = this.backupallItem;
      return;
    }
    // this.allItem = this.query({ encodedText: val, time: val });
    this.allItem = this.query({ indicator: val });
    if (this.allItem == null || this.allItem.length == 0) this.searchResultNull = true;
  }

  query(params?: any) {
    if (!params) return this.allItem;
    return this.allItem.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase()
          .indexOf(params[key].toLowerCase()) >= 0) return item;
        else if (field == params[key]) return item;
      }
      return null;
    });
  }

  async getkeys() {
    const { keys } = await Storage.keys();
    // console.log('Got keys: ', keys);

    let filteredKeyList = [];
    filteredKeyList = keys.filter(key => {
      return key.substr(0, 4) == '_new';
    });

    if (filteredKeyList.length > 0) {
      filteredKeyList.map(key => this.getObject(key));
      this.noData = false;
    }
    else this.noData = true;
    // console.log('filtered keys: ', filteredKeyList);
  }

  async getObject(key) {
    this.allItem = [];
    const ret = await Storage.get({ key: key });
    const user = JSON.parse(ret.value);
    user.key = key;
    this.allItem.push(user);
    this.backupallItem = this.allItem;
    // console.log(this.allItem);
  }

  async clear() {
    await Storage.clear();
  }

  async setObject(storageKey, time, reference, encodedText, indicator) {
    await Storage.set({
      key: storageKey,
      value: JSON.stringify({
        time: time,
        reference: reference,
        encodedText: encodedText,
        indicator: indicator
      })
    }).then(() => {
      if (reference == null) this.toast.presentToast('New data successfully created', 3000, 'top', 'toast-success-class', 'checkmark-outline');
    }).catch(() => this.toast.presentToast('Operation failed', 1000, 'bottom', 'toast-failed-class', 'close-outline'));
  }

  generateKey(ref) {
    let date = new Date();
    this.today = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    let key = ref + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds();
    return key;
  }

  async removeItem(key, encodedData) {
    await Storage.remove({ key: key })
      .then(() => {
        let storageKey = this.generateKey('_log');
        this.setObject(storageKey, this.today, 'Deleted Data', encodedData, null);
        this.toast.presentToast('Delete success', 2000, 'top', 'toast-success-class', 'checkmark-outline');
      })
      .catch(() => this.toast.presentToast('Operation failed', 3000, 'bottom', 'toast-failed-class', 'close-outline'));
  }

  async delete(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: '<strong>Are you sure that you want to delete this item ?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirm',
          handler: () => {
            this.removeItem(item.key, item.encodedText).then(() => {
              this.allItem = [];
              this.getkeys();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // async copy(item) {
  //   Clipboard.write({
  //     string: item.encodedText
  //   })
  //     .then(() => this.toast.presentToast('Text copied successfully', 2000, 'top', 'toast-success-class', 'document-text-outline'))
  //     .catch(() => this.toast.presentToast('Unable to copy text', 2000, 'bottom', 'toast-failed-class', 'close-outline'));

  //   // let result = await Clipboard.read();
  //   // console.log('Got', result.type, 'from clipboard:', result.value);
  // }

  history() {
    this.router.navigate(['/history']);
  }

}
