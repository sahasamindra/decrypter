import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  deleteItem(item){
    console.log(item);
  }

  edit(item){
    console.log('edit');
  }

  delete(item){
    console.log('delete');
  }

}
