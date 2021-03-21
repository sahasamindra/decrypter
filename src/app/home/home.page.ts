import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  today = '';
  decodedData = '';
  remainingTime = 5;
  showMyCard: boolean = false;
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      encodedText: ['', Validators.required],
      reference: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  decrypt() {
    let today = new Date();
    let reference = this.myForm.value.reference;
    let encodedData = this.myForm.value.encodedText;
    this.myForm.reset();

    this.today = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
    let key = this.generateKey(reference, today);
    this.decodedData = atob(encodedData);
    this.showMyCard = true;

    this.setObject(key, this.today, reference, encodedData);

    let interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime == 0) {
        this.showMyCard = false;
        this.remainingTime = 5;
        clearInterval(interval);
      }
    }, 1000);
  }

  async setObject(key, time, reference, encodedText) {
    await Storage.set({
      key: key,
      value: JSON.stringify({
        time: time,
        reference: reference,
        encodedText: encodedText
      })
    });
  }

  generateKey(ref, date) {
    // let date = new Date();
    let key = date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds();
    ref = ref.replace(/\s/g, '');
    key = key + ref.substr(-4);
    return key;
  }

  setBorderColor(item) {
    // console.log(item.el);
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
