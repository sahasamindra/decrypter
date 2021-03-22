import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  allItem = [];

  constructor() {
    this.getkeys();
  }

  ngOnInit() {
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

    console.log(this.allItem);
  }

  async removeItem(key) {
    await Storage.remove({ key: key })
      .then(() => console.log("delete success toast"))
      .catch(() => console.log("delete failed toast"));
  }

  edit(item) {
    console.log('edit');
    console.log(item);
  }

  delete(item) {
    console.log('alert prompt for delete');
    this.removeItem(item.key).then(() => {
      this.allItem = [];
      this.getkeys();
    });
  }

}
