import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { AlertController } from '@ionic/angular';
import { DataControlService } from 'src/services/data-control.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  defaultImage = 'assets/avatar-default-icon.png';
  avatarImage = '';
  user: User = null;
  isEditing = false;
  private originUser: User = null;

  constructor(
    public alertController: AlertController,
    private dataDB: DataControlService,
    private router: Router
  ) {
    this.avatarImage = this.defaultImage;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.originUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {

  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  update() {
    console.log(this.originUser.username);
    console.log(this.user.username);
    this.updateNow().then(
      val => {
        console.log(val);
      }
    );
  }

  async updateNow() {
    let isUpdateName: boolean;
    isUpdateName = this.user.username !== this.originUser.username;
    let isUpdatePassword: boolean;
    isUpdatePassword = this.user.password !== this.originUser.password;
    let objUpdate = {};
    let alertUpdate;

    if (isUpdatePassword || isUpdateName) {
      alertUpdate = await this.alertController.create({
        header: 'Are you sure to update?',
        subHeader: 'Your action cannot be undo',
        message: 'Updating new ',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm cancel');
              alertUpdate.dismiss(false);
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm');
              alertUpdate.dismiss(true).then(val => {
                if (val) {
                  this.backgroundUpdateDB();
                }
              });
            }
          }
        ]
      });
    } else {
      objUpdate = {
        header: 'You did not change any information!',
        buttons: ['OK']
      };

      alertUpdate = await this.alertController.create(objUpdate);
    }


    await alertUpdate.present();
  }

  backgroundUpdateDB() {
    this.dataDB.updateProfile(this.user).then(result => {
      if (result) {
        localStorage.setItem('user', JSON.stringify(this.user));
        this.originUser = this.user;
      }
      console.log(result);
    });
  }

}
