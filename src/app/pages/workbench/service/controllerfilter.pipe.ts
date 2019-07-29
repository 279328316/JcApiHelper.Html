import { Pipe, PipeTransform } from '@angular/core';
import {Area, Controller} from "./api";

@Pipe({name: 'controllerFilter'})
export class ControllerFilterPipe implements PipeTransform {

	transform(allControllerList: Controller[],
            searchText:string,
            selectedArea:Area[]):Controller[] {
		if(!allControllerList){
			return [];
		}
		let controllerList = allControllerList;
		if(searchText){
		  //关键词过滤
		  let filter = searchText.toLowerCase();
      controllerList = allControllerList.filter(controller => {
        let result: boolean = false;
        result = (controller.areaName && controller.areaName.toLowerCase().indexOf(filter) >= 0)
          || (controller.controllerName && controller.controllerName.toLowerCase().indexOf(filter) >= 0)
          || (controller.summary && controller.summary.toLowerCase().indexOf(filter) >= 0)
          || controller.actionList.filter(action => {
                return action.actionName.toLowerCase().indexOf(filter) >= 0
                  || (action.summary && action.summary.toLowerCase().indexOf(filter) >= 0);
        }).length > 0;
        return result;
      });
		}
		if(controllerList.length>0 && selectedArea && selectedArea.length>0){
		  //过滤选中Area
		  controllerList = controllerList.filter(controller=>{
		    return selectedArea.filter(area=>area.areaName==controller.areaName).length>0;
      });
    }
    return controllerList;
	}
}
