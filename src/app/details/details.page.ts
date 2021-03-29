import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import CryptoJS from 'crypto-js';
import { Plugins } from '@capacitor/core';
import { ToastService } from '../services/toast.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  data: any;
  decodedData = '';
  today = '';
  remainingTime = 5;
  showMyCard: boolean = false;
  myForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastService) {
    this.myForm = this.fb.group({
      encodedText: ['', Validators.required],
      reference: ['', [Validators.required, Validators.minLength(4)]],
      key: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
    // console.log(this.route.snapshot.data);
    if (this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.myForm.controls['encodedText'].setValue(this.data.encodedText);
    }
  }

  setBorderColor(item) {
    item.el.style.border = "2px solid red";
    item.el.style.boxShadow = "0.3px 0.3px 20px -2px red";
  }

  resetBorderColor(item) {
    item.el.style.border = "2px solid rgb(86, 3, 134)";
    item.el.style.boxShadow = "none";
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

  decrypt() {
    console.log("decrypt and set log and then route back after the timeout");
    let reference = this.myForm.value.reference;
    let encodedData = this.myForm.value.encodedText;
    let myKey = this.myForm.value.key;
    this.myForm.reset();
    let storageKey = this.generateKey('_log');

    let decryptedBytes = CryptoJS.AES.decrypt(encodedData, myKey);
    this.decodedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (this.decodedData == '' || this.decodedData == null) {
      this.toast.presentToast('Wrong key', 2000, 'bottom', 'toast-failed-class', 'shield-half-outline')
    } else {
      this.showMyCard = true;
      this.setObject(storageKey, this.today, reference, encodedData, null);
      let interval = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime == 0) {
          this.showMyCard = false;
          this.remainingTime = 5;
          clearInterval(interval);
          this.router.navigate(['/list']);
        }
      }, 1000);
    }
  }

}
