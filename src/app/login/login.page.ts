import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { BiometricAuth, SplashScreen } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  myForm: FormGroup;
  showForm: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() { }

  ionViewDidEnter() {
    SplashScreen.hide();
    this.biometricAuthentication();
  }

  /* 
  android/variable.gradel 
  ext {minSdkVersion = 23}
  android/app/src/main/java/io/ionic/starter/MainActivity.java
  import com.ahm.capacitor.biometric.BiometricAuth;
  this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(BiometricAuth.class);
    }});
  */

  async biometricAuthentication() {
    const available = await BiometricAuth.isAvailable();
    if (available.has) {
      const authResult = await BiometricAuth.verify({
        reson: 'Continue with faceID',
        title: 'Continue with fingerprint'
      });

      if (authResult.verified) this.router.navigate(['/home']);
      else this.showForm = true;
      
    } else this.showForm = true;
  }

  validateForm() {
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

  usePassword() {
    this.showForm = true;
  }

  useFingerprint() {
    this.showForm = false;
    this.biometricAuthentication();
  }

}
