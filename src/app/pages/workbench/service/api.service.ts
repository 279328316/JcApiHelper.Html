/**
 * Created by CodeCreator on 2019-03-12.
 */

import {Injectable} from '@angular/core';

import {Jc} from '@core/jc';
import {Action, Controller, PTypeModel} from './api';
import {Observable} from "rxjs/index";

@Injectable()
export class ApiService {

  /*获取ControllerList*/
  public getControllerList (): Observable<Controller[]> {
    return Jc.ajax('ApiHelper/GetControllerList');
  }

  /*获取Controller*/
  public getController (controllerId: string): Observable<Controller> {
    return Jc.ajax('ApiHelper/GetController', {controllerId: controllerId});
  }

  /*获取Action*/
  public getAction (actionId: string): Observable<Action> {
    return Jc.ajax('ApiHelper/GetAction', {actionId: actionId});
  }

  /*获取PType*/
  public getPType (typeId: string): Observable<PTypeModel> {
    return Jc.ajax('ApiHelper/GetPType', {typeId: typeId});
  }

  /*获取TsModel*/
  public getTs (itemId: string, itemType: string): Observable<any> {
    return Jc.ajax('ApiHelper/GetTsModel', {itemId: itemId, itemType: itemType});
  }
}
