import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

// @Pipe({ name: 'safeHtml'})
// export class SafeHtmlPipe implements PipeTransform  {
// 	constructor(private sanitized: DomSanitizer) {}
// 	transform(value) {
// 		console.log(this.sanitized.bypassSecurityTrustHtml(value))
// 		return this.sanitized.bypassSecurityTrustHtml(value);
// 	}
// }

@Pipe({name: 'keywordHighlight'})
export class KeywordHighlightPipe implements PipeTransform {
	constructor(private sanitized: DomSanitizer) {}
	transform(value: string, queryCondition: string):any {
		if(!value){
			return '';
		}
		if(!queryCondition){
			return this.sanitized.bypassSecurityTrustHtml(value);
		}
		if(queryCondition && queryCondition.indexOf("|")!=-1){
      queryCondition = queryCondition.replace(/|/g, ",");
		}
		if(queryCondition && queryCondition.indexOf(" ")!=-1){
      queryCondition = queryCondition.replace(/ /g, ",");
		}
		let result = value;
		let queryArray = queryCondition.split(",");
		for(let i=0;i<queryArray.length;i++){
			//let innerHTMLStr='<span style="color:#ff0000">' + queryArray[i] + '</span>';
			//result=result.replace(new RegExp(queryArray[i],'g'), innerHTMLStr);
      let replaceStr = queryArray[i];
      if(!replaceStr){
        continue;
      }
      let headStr = '<span style="color:#f60">';
      let lastStr = '</span>';
      let lastIndex = result.toLowerCase().indexOf(replaceStr.toLowerCase(),0);
      while (lastIndex!=-1){
        let newresult = result.substr(0,lastIndex) + headStr
          + result.substr(lastIndex,replaceStr.length) + lastStr
          + result.substr(lastIndex + replaceStr.length);
        result = newresult;
        lastIndex = result.toLowerCase().indexOf(replaceStr.toLowerCase(),lastIndex + headStr.length + replaceStr.length + lastStr.length);
      }
		}
		return this.sanitized.bypassSecurityTrustHtml(result);
	}
}
