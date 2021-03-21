import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  
  cardElement = [];

  constructor() {
    this.getkeys();
  }

  ngOnInit() {
  }

  async getkeys() {
    const { keys } = await Storage.keys();
    // console.log('Got keys: ', keys);
    keys.map(key => this.getObject(key));
  }

  async getObject(key) {
    const ret = await Storage.get({ key: key });
    const user = JSON.parse(ret.value);
    this.cardElement.push(user);
  
    // console.log(this.cardElement);
  }
}
