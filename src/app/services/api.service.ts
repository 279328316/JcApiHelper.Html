﻿/**
 * Created by CodeCreator on 2019-03-12.
 */

import { Injectable } from "@angular/core";

import { Util } from "@core/util";
import { Action, Controller, PTypeModel } from "../models/api";
import { Observable } from "rxjs";
import { ContentType } from "@models/robj";

@Injectable()
export class ApiService {
  public apiVersion: string = "";

  /*获取apiVersion*/
  public getApiVersion(): void {
    if (!this.apiVersion) {
      Util.ajax("ApiHelper/getApiVersion").subscribe((apiVersion: string) => {
        this.apiVersion = apiVersion;
      });
    }
  }

  /*获取ControllerList*/
  public getControllerList(): Observable<Controller[]> {
    return Util.ajax("ApiHelper/GetControllerList");
  }

  /*获取ControllerListByIds*/
  public getControllerListByIds(ids: string[]): Observable<Controller[]> {
    return Util.ajax("ApiHelper/GetControllerListByIds", ids, ContentType.json);
  }

  /*获取Controller*/
  public getController(controllerId: string): Observable<Controller> {
    return Util.ajax("ApiHelper/GetController", { controllerId: controllerId });
  }

  /*获取Action*/
  public getAction(actionId: string): Observable<Action> {
    return Util.ajax("ApiHelper/GetAction", { actionId: actionId });
  }

  /*获取PType*/
  public getPType(typeId: string): Observable<PTypeModel> {
    return Util.ajax("ApiHelper/GetPType", { typeId: typeId });
  }

  /*获取TsModel*/
  public getTs(itemId: string, itemType: string): Observable<any> {
    return Util.ajax("ApiHelper/GetTsModel", { itemId: itemId, itemType: itemType });
  }
  /*获取Code File Tree*/
  public getCodeTree(controllerId: string): Observable<any> {
    return Util.ajax("ApiHelper/getCodeTree", { controllerId: controllerId });
  }
}
