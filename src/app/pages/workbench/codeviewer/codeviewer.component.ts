import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ActivatedRoute } from '@angular/router';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PageTreeNode, PageType, TsModel, TsResult } from '@models/tsmodel';
import {
  BooleanDisplayType,
  DateDisplayType,
  DisplayType,
  EnumDisplayType,
  NumberDisplayType,
  TsPi,
} from '@models/propertyinfo';
import { Util } from '@core/util';
import { StringHelper } from '@core/stringhelper';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { PageHelper } from '@core/PageHelper/pagehelper';
import { CodeCreator } from '@core/PageHelper/codecreator';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CodeGenerateConfigComponent } from '../codegenerateconfig/codegenerateconfig.component';
import { DateHelper } from '@core/datehelper';

@Component({
  selector: 'app-codeviewer',
  templateUrl: './codeviewer.component.html',
  styleUrls: ['./codeviewer.component.less'],
})
export class CodeViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('nzTree', { static: false }) nzTree!: NzTreeComponent;
  itemId: string;
  itemType: string;
  tsServiceType = '1';
  tsModelViewType = '1';

  isAfterViewInit: boolean = false;

  tsResult: TsResult = new TsResult();
  tsModelList: TsModel[] = [];
  pageModelList: TsModel[] = [];

  tsModelCode: string;
  tsModelCodeWithPgQuery: string;

  pageBaseModel: TsModel;

  showCode: boolean = false;
  codeTitle: string;
  tsCode: string;

  isCtrlDown: boolean = false;
  isShiftDown: boolean = false;

  rootNode: NzTreeNode;

  rootNodeOptions: NzTreeNodeOptions = <NzTreeNodeOptions>{
    title: 'pages',
    key: 'pages',
    isLeaf: false,
    expanded: true,
    children: [],
  };

  pageNodes: NzTreeNodeOptions[] = [this.rootNodeOptions];
  activatedNode?: NzTreeNode;

  pageCode = '';
  pageCodeTitle = '';
  pageLanguage = 'html';

  constructor(
    private routerParams: ActivatedRoute,
    private nzContextMenuService: NzContextMenuService,
    private modalSvc: NzModalService,
    private apiSvc: ApiService
  ) {
    const tsServiceType = localStorage.getItem('tsServiceType');
    this.tsServiceType = tsServiceType ? tsServiceType : '1';

    const tsModelViewType = localStorage.getItem('tsModelViewType');
    this.tsModelViewType = tsModelViewType ? tsModelViewType : '1';
  }

  ngOnInit() {
    this.itemId = this.routerParams.snapshot.paramMap.get('itemId');
    this.itemType = this.routerParams.snapshot.paramMap.get('itemType');
  }

  ngAfterViewInit(): void {
    this.isAfterViewInit = true;
    this.rootNode = this.nzTree.getTreeNodeByKey(this.rootNodeOptions.key);
    this.getTsModel();
  }

  /*获取TsModel*/
  getTsModel() {
    this.apiSvc.GetTsModel(this.itemId, this.itemType).subscribe((tsResult: TsResult) => {
      this.tsResult = tsResult;
      this.tsModelList = this.tsResult.tsModelList;
      this.pageModelList = this.tsModelList?.filter((x) => !x.isEnum && x.name.indexOf('<') < 0);
      if (this.pageModelList?.length > 0) {
        let filterModels = this.tsModelList.filter((x) => x.name.toLowerCase() === this.tsResult.name.toLowerCase());
        if (filterModels.length > 0) {
          this.pageBaseModel = filterModels[0];
        } else {
          this.pageBaseModel = this.pageModelList[0];
        }
        if (this.pageBaseModel) {
          this.generatePages(true);
        }
      }
    });
  }

  // BaseModelChange
  pageBaseModelChange(value: TsModel): void {
    if (value) {
    }
  }

  // 生成页面代码
  generatePages(isAuto = false) {
    if (!this.pageBaseModel) {
      return;
    }
    this.loadConfigFromStorage(this.pageBaseModel);
    if (!isAuto) {
      let title = 'Pages Generate Config for ' + this.pageBaseModel.name;
      const modal: NzModalRef = this.modalSvc.create({
        nzTitle: title,
        nzWidth: 1360,
        nzContent: CodeGenerateConfigComponent,
        nzData: { configModel: this.pageBaseModel },
        nzCentered: true,
        nzDraggable: true,
        nzMaskClosable: false,
        nzNoAnimation: true,
        nzFooter: null,
        nzOkText: null,
        nzCancelText: null,
      });
      modal.afterClose.subscribe((result) => {
        if (result) {
          localStorage.setItem('generateConfig' + this.pageBaseModel.id, JSON.stringify(this.pageBaseModel));
          this.doGeneratePages();
        }
      });
    } else {
      this.doGeneratePages();
    }
  }

  // 生成页面代码
  doGeneratePages() {
    if (!this.pageBaseModel || !this.rootNode) {
      return;
    }
    try {
      let rootNodeChildren = this.rootNode.getChildren();
      let existsNode = rootNodeChildren.find((a) => a.key === this.pageBaseModel.id.toLowerCase());
      let index = rootNodeChildren.findIndex((a) => a.key === existsNode?.key);
      if (existsNode) {
        existsNode.remove();
      }
      let pageNode = PageHelper.generatePageNode(this.pageBaseModel);
      let treeNodeOptions: NzTreeNodeOptions = pageNode as NzTreeNodeOptions;
      if (index != -1) {
        this.rootNode.addChildren([treeNodeOptions], index);
      } else {
        this.rootNode.addChildren([treeNodeOptions]);
      }
    } catch (error) {
      Util.showErrorMessageBox(error);
    }
  }

  loadConfigFromStorage(pageBaseModel: TsModel) {
    let storageConfigStr = localStorage.getItem('generateConfig' + this.pageBaseModel?.id);
    let storageConfig = JSON.parse(storageConfigStr) as TsModel;
    if (storageConfig) {
      pageBaseModel.editPageType = storageConfig.editPageType;
      pageBaseModel.detailPageType = storageConfig.detailPageType;

      let piList = pageBaseModel.piList;
      let storagePiList = storageConfig.piList;
      piList?.forEach((a) => {
        let storagePi = storagePiList.filter((b) => b.name === a.name)[0];
        if (storagePi && storagePi.tsType === a.tsType) {
          a.isKeyvalueItem = storagePi.isKeyvalueItem;
          a.isQuery = storagePi.isQuery;
          a.queryDisplayType = storagePi.queryDisplayType;
          a.isList = storagePi.isList;
          a.isListSort = storagePi.isListSort;
          a.listDisplayType = storagePi.listDisplayType;
          a.isEdit = storagePi.isEdit;
          a.isRequire = storagePi.isRequire;
          a.editDisplayType = storagePi.editDisplayType;
          a.isDetail = storagePi.isDetail;
          a.detailDisplayType = storagePi.detailDisplayType;
        }
      });
    }
  }

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node as NzTreeNode;
    if (!this.activatedNode.isLeaf) {
      this.activatedNode.isExpanded = !this.activatedNode.isExpanded;
      this.pageCode = '';
      this.pageLanguage = 'html';
      this.pageCodeTitle = this.activatedNode.title;
    } else {
      let pageTreeNode = this.activatedNode?.origin as PageTreeNode;
      this.pageCode = pageTreeNode.code;
      this.pageLanguage = pageTreeNode.language;
      this.pageCodeTitle = pageTreeNode?.title;
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  /*选择Model 属性*/
  selectPi(tsModel: TsModel, pi: TsPi, index: number) {
    this.tsResult.tsModelList.forEach((a) => {
      if (a !== tsModel) {
        a.piList.forEach((p) => {
          p.isSelected = false;
        });
      }
    });

    if (!this.isCtrlDown && !this.isShiftDown) {
      //如果非多选,取消其它选中
      tsModel.piList
        .filter((a) => a.isSelected === true)
        .forEach((a, index) => {
          if (a != pi) {
            a.isSelected = false;
          }
        });
      pi.isSelected = !pi.isSelected;
    } else if (this.isCtrlDown) {
      pi.isSelected = !pi.isSelected;
    } else if (this.isShiftDown) {
      let minIndex: number = -1;
      let maxIndex: number = -1;
      tsModel.piList
        .filter((a) => a.isSelected === true)
        .forEach((a) => {
          let index = tsModel.piList.indexOf(a);
          if (minIndex === -1 || minIndex > index) {
            minIndex = index;
          }
          if (maxIndex === -1 || maxIndex < index) {
            maxIndex = index;
          }
        });
      if (minIndex === -1) {
        //之前没有选中的
        pi.isSelected = !pi.isSelected;
        return;
      }
      if (index === minIndex || index === maxIndex) {
        //选中当前第一条或最后一条
        pi.isSelected = !pi.isSelected;
        return;
      }

      //Shift按下 选中原则 从低到高
      if (index < minIndex) {
        //选中下面的行
        for (let i = index; i <= maxIndex; i++) {
          tsModel.piList[i].isSelected = true;
        }
      } else if (index > maxIndex) {
        //选中上面的行
        for (let i = minIndex; i <= index; i++) {
          tsModel.piList[i].isSelected = true;
        }
      } else {
        //选中中间行
        for (let i = minIndex; i <= index; i++) {
          tsModel.piList[i].isSelected = true;
        }
        for (let i = index + 1; i <= maxIndex; i++) {
          tsModel.piList[i].isSelected = false;
        }
      }
    }
  }

  /* name参数排序 */
  nameSortFn(a: any, b: any, sortOrder: string) {
    return a['name'].localeCompare(b['name']);
  }

  /* value参数排序 */
  valueSortFn(a: any, b: any, sortOrder: string) {
    return a['paramValue'] - b['paramValue'];
  }

  /* type参数排序 */
  typeSortFn(a: any, b: any, sortOrder: string) {
    return a['tsType'].localeCompare(b['tsType']);
  }

  /*查看Lambda Code*/
  viewLambda(tsModel: TsModel) {
    if (tsModel.piList.filter((a) => a.isSelected).length <= 0) {
      Util.showInfoBox('No record is selected.');
      return;
    }
    let selectedPiList = tsModel.piList.filter((a) => a.isSelected);

    // SetValue Lambda
    let setValueLambda = '//1 SetValue \r\n';
    setValueLambda +=
      tsModel.name + ' ' + StringHelper.firstToLower(tsModel.name) + ' = new ' + tsModel.name + '();\r\n';
    selectedPiList.forEach((a, index) => {
      setValueLambda +=
        StringHelper.firstToLower(tsModel.name) +
        '.' +
        StringHelper.firstToLower(a.name) +
        ' = source.' +
        StringHelper.firstToLower(a.name) +
        ';\r\n';
    });

    // Ctor Lambda
    let ctorLambda = '//2 C# Ctor \r\n';
    ctorLambda += tsModel.name + ' ' + StringHelper.firstToLower(tsModel.name) + ' = new ' + tsModel.name + '(){\r\n';
    selectedPiList.forEach((a, index) => {
      ctorLambda += '  ' + a.name + ' = source.' + a.name;
      if (index < selectedPiList.length - 1) {
        ctorLambda += ',';
      }
      ctorLambda += '\r\n';
    });
    ctorLambda += '};\r\n';

    // Expression Lambda
    let expLambda = '//3 Expression Lambda \r\n';
    if (selectedPiList.length == 1) {
      //length == 1
      expLambda += 'a => a.' + selectedPiList[0].name + '\r\n';
    } else {
      //length > 1
      expLambda += 'var exp = ExpressionHelper.CreateExpression<' + tsModel.name + '>(a => new {\r\n';
      selectedPiList.forEach((a, index) => {
        expLambda += '  ' + 'a.' + a.name;
        if (index < selectedPiList.length - 1) {
          expLambda += ',';
        }
        expLambda += '\r\n';
      });
      expLambda += '};\r\n';
    }

    this.tsCode = '\r\n' + setValueLambda + '\r\n' + ctorLambda + '\r\n' + expLambda;
    this.codeTitle = tsModel.name + ' Lambda';
    this.showCode = true;
  }

  /*隐藏Modal*/
  closeModal() {
    this.showCode = false;
  }

  /*ModelView类型变化*/
  modelViewTypeChanged() {
    localStorage.setItem('tsModelViewType', this.tsModelViewType);
  }

  /*使用服务类型变化*/
  tsServiceTypeChanged() {
    localStorage.setItem('tsServiceType', this.tsServiceType);
  }

  /*keyDownHandler*/
  onKeyDownHandler(event: any): void {
    switch (event.keyCode) {
      case 16: //Shift  暂时不支持Shift
        this.isShiftDown = true;
        event.preventDefault();
        break;
      case 17: //Ctrl
        this.isCtrlDown = true;
        event.preventDefault();
        break;
      case 37: //← 左
        break;
      case 38: //↑ 上
        if (this.isCtrlDown || this.isShiftDown) {
        } else {
        }
        event.preventDefault();
        break;
      case 39: //→ 右
        break;
      case 40: //↓ 下
        if (this.isCtrlDown || this.isShiftDown) {
        } else {
        }
        event.preventDefault();
        break;
      default:
        break;
    }

    //console.log('onKeyDown this.isShiftDown:',this.isShiftDown);
    //console.log('onKeyDown this.isCtrlDown:',this.isCtrlDown);
  }

  /*keyUpHandler*/
  onKeyUpHandler(event: any): void {
    switch (event.keyCode) {
      case 16: //Shift
        this.isShiftDown = false;
        event.preventDefault();
        break;
      case 17: //Ctrl
        this.isCtrlDown = false;
        event.preventDefault();
        break;
      default:
        break;
    }
    //console.log('onKeyUp this.isShiftDown:',this.isShiftDown);
    //console.log('onKeyUp this.isCtrlDown:',this.isCtrlDown);
  }

  /*导出代码*/
  exportTsCode() {
    if (!this.rootNode) {
      return;
    }
    if (!this.tsResult?.tsCode) {
      return;
    }
    const zip: JSZip = new JSZip();
    let folderName =
      'Code_' + this.tsResult.controllerName + '_' + DateHelper.formatDate(new Date(), 'yyyyMMddhhmmss');
    let rootFolder = zip.folder(folderName);
    // 生成文件
    if (this.tsResult.tsCode?.tsModelCode) {
      let modelFolder = rootFolder.folder('models');
      let modelFileName = this.tsResult.controllerName.toLowerCase() + '.model.ts';
      modelFolder.file(modelFileName, this.tsResult.tsCode.tsModelCode);
    }
    // 生成文件
    if (this.tsResult.tsCode?.tsServiceCode) {
      let serviceFolder = rootFolder.folder('services');
      let serviceFileName = this.tsResult.controllerName.toLowerCase() + '.service.ts';
      serviceFolder.file(serviceFileName, this.tsResult.tsCode.tsServiceCode);
    }
    this.addTreeNodeToZip(rootFolder, this.rootNode);
    // 生成ZIP文件
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      // 使用FileSaver.js的saveAs方法来保存文件
      saveAs(blob, folderName + '.zip');
    });
  }

  /*将Pages生成zip文件*/
  addTreeNodeToZip(zip: JSZip, node: NzTreeNode) {
    let originNode = node.origin as PageTreeNode;
    if (originNode.isLeaf) {
      zip.file(originNode.title, originNode.code);
    } else {
      let folder = zip.folder(originNode.title);
      node.getChildren().forEach((childNode) => {
        this.addTreeNodeToZip(folder, childNode);
      });
    }
  }

  /*返回 使用浏览器后退功能*/
  goback() {
    history.back();
  }
}
