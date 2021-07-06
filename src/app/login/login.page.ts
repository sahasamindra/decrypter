import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { ToastService } from '../services/toast.service';
import '@capacitor-community/camera-preview'
import { CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';

const { BiometricAuth, SplashScreen, Storage, CameraPreview } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  myForm: FormGroup;
  showForm: boolean;
  iconName = 'sunny-outline';

  image = null;
  cameraActive = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public modalController: ModalController,
    private toast: ToastService) {
    this.myForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.checkUser();
  }

  async openCamera() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview'
    };

    await CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;
  }

  async stopCamera() {
    await CameraPreview.stop();
    this.cameraActive = false;
  }

  async captureImage() {
    const camrePreviewPicruteOption: CameraPreviewPictureOptions = {
      quality: 50
    }
    const result = await CameraPreview.capture(camrePreviewPicruteOption);
    // console.log(result);
    this.image = `data:image/jpeg;base64,${result.value}`;
    this.stopCamera();
    console.log(this.image);
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

  toggleTheme(ev) {
    if (ev.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      this.iconName = 'moon-outline';
    } else {
      // document.body.setAttribute('color-theme', 'light');
      document.body.removeAttribute('color-theme');
      this.iconName = 'sunny-outline';
    }
  }

  async checkUser() {
    const { value } = await Storage.get({ key: 'user-auth-token' });
    if (value == null) {
      SplashScreen.hide();
      this.toast.presentToast('Please register to continue', 3000, 'bottom', 'toast-failed-class', 'person-add-outline')
      this.presentRegModal();
    } else {
      this.showForm = false;
      this.biometricAuthentication();
    }
  }

  async presentRegModal() {
    const modal = await this.modalController.create({
      component: RegisterPage
    });
    modal.onDidDismiss().then((dataReturned) => {
      let auth = dataReturned.data;
      if (auth !== undefined) this.setUser(auth);
    });
    return await modal.present();
  }

  async biometricAuthentication() {
    const available = await BiometricAuth.isAvailable();
    if (available.has) {
      SplashScreen.hide();
      const authResult = await BiometricAuth.verify({
        reson: 'Continue with faceID',
        title: 'Continue with fingerprint'
      });

      // if (authResult.verified) this.router.navigate(['/home']);
      if (authResult.verified) this.router.navigate(['/list']);
      else this.showForm = true;
    } else {
      SplashScreen.hide();
      this.showForm = true;
    }
  }

  async validateUser() {
    const ret = await Storage.get({ key: 'user-auth-token' });
    if (this.myForm.value.password == ret.value) {
      this.myForm.reset();
      // this.router.navigate(['/home']);
      this.router.navigate(['/list']);
    } else this.toast.presentToast('Authentication failed', 3000, 'bottom', 'toast-failed-class', 'shield-half-outline');
  }

  async setUser(token) {
    const ret = await Storage.get({ key: 'user-auth-token' });
    if (ret.value == null || ret.value == '' || ret.value == undefined) {
      await Storage.set({ key: 'user-auth-token', value: token })
        .then(() => this.toast.presentToast('Success! Please remember your password', 3000, 'top', 'toast-success-class', 'checkmark-outline'))
        .catch(() => this.toast.presentToast('Registration failed', 3000, 'bottom', 'toast-failed-class', 'close-outline'));
    } else this.toast.presentToast('User already exist', 3000, 'bottom', 'toast-failed-class', 'close-outline');
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
