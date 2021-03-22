import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastService } from '../services/toast.service';
const { Storage, Clipboard } = Plugins;

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  allItem = [];
  backupallItem = [];
  searchResultNull: boolean = false;

  constructor(private toast: ToastService) {
    this.getkeys();
  }

  ngOnInit() {
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
      return key.substr(-4) == '_new';
    });

    filteredKeyList.map(key => this.getObject(key));
    // console.log('filtered keys: ', filteredList);
  }

  async getObject(key) {
    const ret = await Storage.get({ key: key });
    const user = JSON.parse(ret.value);
    user.key = key;
    this.allItem.push(user);
    this.backupallItem = this.allItem;

    // console.log(this.allItem);
  }

  async removeItem(key) {
    await Storage.remove({ key: key })
      .then(() => this.toast.presentToast('delete success', 2000, 'top', 'toast-success-class', 'checkmark-outline'))
      .catch(() => this.toast.presentToast('operation failed', 3000, 'bottom', 'toast-failed-class', 'close-outline'));
  }

  delete(item) {
    console.log('alert prompt for delete');

    this.removeItem(item.key).then(() => {
      this.allItem = [];
      this.getkeys();
    });
  }

  async copy(item) {
    Clipboard.write({
      string: item.encodedText
    })
      .then(() => this.toast.presentToast('text copied successfully', 2000, 'top', 'toast-success-class', 'document-text-outline'))
      .catch(() => this.toast.presentToast('unable to copy text', 3000, 'bottom', 'toast-failed-class', 'close-outline'));

    // let result = await Clipboard.read();
    // console.log('Got', result.type, 'from clipboard:', result.value);
  }

}
