import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  myRegForm: FormGroup;

  constructor(private fb: FormBuilder, public modalController: ModalController, private toast: ToastService) {
    this.myRegForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnfPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  dismiss(pwd) {
    this.modalController.dismiss(pwd);
  }

  save() {
    if (this.myRegForm.value.password == this.myRegForm.value.cnfPassword) {
      this.dismiss(this.myRegForm.value.password);
      this.myRegForm.reset();
    } else this.toast.presentToast('Both the password should match', 2000, 'bottom', 'toast-failed-class', 'close-outline')
  }

  setBorderColor(item) {
    item.el.style.border = "2px solid red";
    item.el.style.boxShadow = "0.3px 0.3px 20px -2px red";
  }

  resetBorderColor(item) {
    item.el.style.border = "2px solid rgb(86, 3, 134)";
    item.el.style.boxShadow = "none";
  }

}
