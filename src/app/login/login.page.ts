import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  myForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private faio: FingerprintAIO) {
    this.myForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  check() {
    console.log('check');
    this.faio.isAvailable().then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }



  show() {
    //   console.log('show');
    //   this.faio.show({
    //     clientId: 'Fingerprint-Demo',
    //     clientSecret: 'password', // Only necessary for Android
    //     disableBackup: true,  // Only for Android(optional)
    //     localizedFallbackTitle: 'Use Pin', // Only for iOS
    //     localizedReason: 'Please authenticate' // Only for iOS
    //   }).then(result => {
    //     console.log(result);
    //   }).catch(err => {
    //     console.log(err);
    //   });

    this.faio.show({
      title: 'Biometric Authentication', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
      subtitle: 'Coolest Plugin ever', // (Android Only) | optional | Default: null
    description: 'Please authenticate', // optional | Default: null
    fallbackButtonTitle: 'Use Backup', // optional | When disableBackup is false defaults to "Use Pin".
      // When disableBackup is true defaults to "Cancel"
      disableBackup: true,  // optional | default: false
    })
      .then((result: any) => console.log(result))
      .catch((error: any) => console.log(error));
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    const { SplashScreen } = Plugins;
    SplashScreen.hide();
  }

  validateForm() {
    // console.log(this.myForm.value.password);
    if (this.myForm.value.password == "sahasamindra5546") {
      this.myForm.reset();
      this.router.navigate(['/home']);
    } else {
      console.log("acces denied animation and border blinking animation 3 times");
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
