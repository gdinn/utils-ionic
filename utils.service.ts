import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingOptions, AlertOptions } from '@ionic/core';

interface PresentedLoadings {
  [id: string]: HTMLIonLoadingElement
}

interface PresentedAlerts {
  [id: string]: HTMLIonAlertElement
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  presentedLoadings: PresentedLoadings[] = []
  presentedAlerts: PresentedAlerts[] = []
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ){}

  presentAlert(id: string, config: AlertOptions): Observable<HTMLIonAlertElement>{
    // - Create a alert in the form of an observable
    // - Save the alert element in the array of alerts
    return Observable.create(observer => {
      this.alertCtrl.create(config).then(alert => {
        alert.present().then(()=>{
          this.presentedAlerts.push({[id]: alert})
          observer.next()
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Alert error", obj: err}})
        })
      })
      .catch(err => {
        observer.error({error: {msg: "Alert error", obj: err}})
      })      
    })
  }

  dismissAlert(id: string): Observable<boolean> {
    // - Dismiss an alert
    // - Delete the alert element in the array of alerts
    return Observable.create(observer => {      
      let i = this.presentedAlerts.findIndex(alert => alert[id])
      if(i > -1){
        this.presentedAlerts[i][id].dismiss().then(()=>{
          this.presentedAlerts.splice(i, 1)
          observer.next(true)
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Alert error", obj: err}})
        })
      } else {
        observer.error({error: {msg: "Alert already dismissed"}})
      }      
    })
  }

  presentLoading(id: string, config: LoadingOptions = {message: "Please wait..."}): Observable<HTMLIonLoadingElement>{
    // - Create a loading in the form of an observable
    // - Save the loading element in the array of loadings    
    return Observable.create(observer => {
      this.loadingCtrl.create(config).then((loading)=>{
        loading.present().then(()=>{
          this.presentedLoadings.push({[id]: loading})
          console.log("Loading called, id: ", id)
          observer.next()
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Loading error", obj: err}})
        })
      })
      .catch(err => {
        observer.error({error: {msg: "Loading error", obj: err}})
      })
    })
  }

  dismissLoading(id: string): Observable<boolean> {
    // - Dismiss an loading
    // - Delete the loading element in the array of loadings 
    return Observable.create(observer => {      
      let i = this.presentedLoadings.findIndex(loading => loading[id])
      if(i > -1){
        this.presentedLoadings[i][id].dismiss().then(()=>{
          this.presentedLoadings.splice(i, 1)
          console.log("loading dismissed, id: ", id)
          observer.next(true)
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Loading error", obj: err}})
        })
      } else {
        observer.error({error: {msg: "Loading error"}})
      }      
    })
  }

  getLocationWeb(): Observable<{coords: {latitude: number, longitude: number} | string}>{
    console.log("Called getLocationWeb (rxjs)")
    let error_msg
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          position => {
            observer.next({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            })
            observer.complete()
          },
          error => {
            switch (error.code) {
              case 1:
                console.log('Location: Permission Denied');
                error_msg = 'Error obtaining location. Permission Denied.'
                break; 
              case 2:
                console.log('Location: Position Unavailable');
                error_msg = 'Error obtaining location. Position Unavailable.'
                break;
              case 3:
                console.log('Location: Timeout');
                error_msg = 'Error obtaining location. Timeout ocurred.'
                break;
            }
            observer.error(error_msg)
          }
        )
      }
    })    
  }
}