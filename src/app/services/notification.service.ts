import { Injectable } from '@angular/core';
import { Notification } from '../models/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(){}

  notification: Notification = {display: false, status: 'success', title: 'Notificación de prueba', description: 'Esta es una notificación de prueba'};

  showNotification(notification: Notification){
    this.notification = notification
    this.notification.display = true

    setTimeout(() => {
      this.notification.display = false
    }, 5000)
  }

  closeNotification(){
    this.notification.display = false
  }
}
