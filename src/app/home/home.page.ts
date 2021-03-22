import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import CryptoJS from 'crypto-js';
import { ToastService } from '../services/toast.service';
const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  today = '';
  decodedData = '';
  buttonText = 'Add';
  remainingTime = 5;

  showMyCard: boolean = false;
  displayAddForm: boolean = false;

  myForm: FormGroup;
  addForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toast: ToastService) {
    this.myForm = this.fb.group({
      encodedText: ['', Validators.required],
      reference: ['', [Validators.required, Validators.minLength(4)]],
      key: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.addForm = this.fb.group({
      plainText: ['', Validators.required],
      key: ['', [Validators.required, Validators.minLength(4)]],
      indicator: ['', [Validators.required, Validators.maxLength(4)]]
    });
  }

  encrypt(btn) {
    let encryptedAES = CryptoJS.AES.encrypt(this.addForm.value.plainText, this.addForm.value.key);
    let storageKey = this.generateKey('_new');
    this.setObject(storageKey, this.today, '_new', encryptedAES.toString(), this.addForm.value.indicator)
      .then(() => {
        this.addForm.reset();
        this.displayAddForm = true;
        this.showAddForm(btn);
      });
  }

  decrypt() {
    let reference = this.myForm.value.reference;
    let encodedData = this.myForm.value.encodedText;
    let myKey = this.myForm.value.key;
    this.myForm.reset();
    let storageKey = this.generateKey(reference);

    let decryptedBytes = CryptoJS.AES.decrypt(encodedData, myKey);
    this.decodedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (this.decodedData == '' || this.decodedData == null) {
      console.log("access denied animation and border blinking animation 3 times");
    } else {
      this.showMyCard = true;
      this.setObject(storageKey, this.today, reference, encodedData, '');
      let interval = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime == 0) {
          this.showMyCard = false;
          this.remainingTime = 5;
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  showAddForm(item) {
    if (this.displayAddForm == false) {
      this.displayAddForm = true;
      this.buttonText = 'Cancel'
      item.el.color = 'danger'
    } else {
      this.displayAddForm = false;
      this.buttonText = 'Add'
      item.el.color = 'light'
    }
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
      if (reference == '_new') this.toast.presentToast('new data successfully created', 3000, 'top', 'toast-success-class', 'checkmark-outline');
    }).catch(() => this.toast.presentToast('operation failed', 3000, 'bottom', 'toast-failed-class', 'close-outline'));
  }

  generateKey(ref) {
    let date = new Date();
    this.today = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    let key = date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds();
    ref = ref.replace(/\s/g, '');
    key = key + ref.substr(-4);
    return key;
  }

  setBorderColor(item) {
    item.el.style.border = "2px solid red";
    item.el.style.boxShadow = "0.3px 0.3px 20px -2px red";
  }

  resetBorderColor(item) {
    item.el.style.border = "2px solid rgb(86, 3, 134)";
    item.el.style.boxShadow = "none";
  }

  history() {
    this.router.navigate(['/history']);
  }

}
