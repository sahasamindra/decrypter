import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  encryptedAES; 
  decryptedBytes; 
  plaintext;
  encrytedText;
  decryptedtext;

  myForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.algo();
    this.myForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  algo() {
    this.encryptedAES = CryptoJS.AES.encrypt("thisIs@myPassword", "safwan");
    this.decryptedBytes = CryptoJS.AES.decrypt(this.encryptedAES, "safwan");
    this.plaintext = this.decryptedBytes.toString(CryptoJS.enc.Utf8);
    this.encrytedText = this.encryptedAES.toString();
    this.decryptedtext = this.decryptedBytes.toString();
    console.log('this is encrypted text: ', this.encrytedText);
    console.log('this is decrypted text: ', this.decryptedtext);
    console.log('this is original text: ', this.plaintext);
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    const { SplashScreen } = Plugins;
    SplashScreen.hide();
  }

  validateForm() {
    console.log(this.myForm.value.password);
    if (this.myForm.value.password == "sahasamindra5546") {
      this.myForm.reset();
      this.router.navigate(['/home']);
    }
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

}
