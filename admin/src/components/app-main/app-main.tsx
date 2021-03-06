import { toastController } from "@ionic/core";
import { Component, h, Host } from "@stencil/core";
import { logoutOfAPI } from "../../services/auth.service";

@Component({
  tag: 'app-main',
  styleUrl: 'app-main.css'
})
export class AppMain {

  async logout() {
    const ionNav = document.querySelector('ion-nav');
    try {
      const res = await logoutOfAPI();
      let message = ''
      if (res) {
        message = 'User was signed out.'
      } else {
        message = 'User was not signed in.'
      }
      const toast = await toastController.create({
        message: message,
        duration: 500,
      });
      await toast.present();
      ionNav.pop();
    } catch (error) {
      const toast = await toastController.create({
        message: error,
        duration: 500,
      });
      await toast.present();
    }
    
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Main Page</ion-title>
            <ion-buttons slot="start">
              <ion-button onClick={() => this.logout()}>
                <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button href="/main/edit">
                <ion-icon name="create-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <app-entry-form></app-entry-form>
        </ion-content>
      </Host>
    );
  }
}

