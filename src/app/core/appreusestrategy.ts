import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {Injectable} from '@angular/core';
import {isFunction} from 'util';

interface IRouteConfigData {
  reuse: boolean;
}

interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}

@Injectable()
export class AppReuseStrategy implements RouteReuseStrategy {
  private static routeCache = new Map<string, ICachedRoute>();
  private static waitDelete: string; // 当前页未进行存储时需要删除
  private static currentDelete: string;  // 当前页存储过时需要删除

  /** 进入路由触发，判断是否是同一路由 */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    let result = future.routeConfig === curr.routeConfig;
    return result;
  }

  /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断，这里判断是否有data数据判断是否复用 */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    let result = false;
    const data = this.getRouteData(route);
    if (data && data.reuse) {
      result = true;
    }
    // console.log('shouldDetach:', route.routeConfig['path'], result);
    return result;
  }

  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象
   * handle: DetachedRouteHandle
   * */
  store(route: ActivatedRouteSnapshot, handle: any): void {
    const url = this.getRouteUrl(route);
    const data = this.getRouteData(route);
    if (AppReuseStrategy.waitDelete && AppReuseStrategy.waitDelete === url) {
      // 如果待删除是当前路由，且未存储过则不存储快照
      AppReuseStrategy.waitDelete = null;
      return null;
    } else {
      // 如果待删除是当前路由，且存储过则不存储快照
      if (AppReuseStrategy.currentDelete && AppReuseStrategy.currentDelete === url) {
        AppReuseStrategy.currentDelete = null;
        return null;
      } else {
        AppReuseStrategy.routeCache.set(url, {handle, data});
        // console.log('Store:', url, handle);
        this.addRedirectsRecursively(route);
        if (handle && handle.componentRef) {
          this.runHook('_onReuseDestroy', url, handle.componentRef);
        }
      }
    }
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // 在路由是login的时候清空缓存
    if (route.routeConfig['path'].indexOf('login') >= 0) {
      AppReuseStrategy.routeCache.clear();
      return false;
    }
    const url = this.getRouteUrl(route);
    // console.log('shouldAttach:', url, AppReuseStrategy.routeCache.has(url));
    return AppReuseStrategy.routeCache.has(url);
  }

  /** 从缓存中获取快照，若无则返回nul */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getRouteUrl(route);
    const data = this.getRouteData(route);
    let handle: any = data && data.reuse && AppReuseStrategy.routeCache.has(url)
      ? AppReuseStrategy.routeCache.get(url).handle
      : null;

    //console.log('retrieve:', url, route);

    if (handle && handle.componentRef) {
      this.runHook('_onReuseInit', url, handle.componentRef);
    }
    return handle;
  }

  private runHook(method: string, url: string, comp: any) {
    // console.log('runHook:',comp.instance);
    if (comp.instance && comp.instance[method]
      && isFunction(comp.instance[method])) {
      comp.instance[method]();
    }
  }

  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    //console.log('addRedirectsRecursively:', config);
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
    }
  }

  /*获取完整路由Url*/
  private getRouteUrl(route: ActivatedRouteSnapshot): string {
    return route['_routerState'].url.replace(/\//g, '_')
      + '_' + (route.routeConfig.loadChildren || route.routeConfig.component.toString().split('(')[0].split(' ')[1]);
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    let path = route.url.map(urlSegment => urlSegment.path);
    // console.log('getRouteUrlPaths:', path);
    return path;
  }

  private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
    return route.routeConfig && route.routeConfig.data as IRouteConfigData;
  }

  /** 用于删除路由快照*/
  public static deleteRouteSnapshot(url: string): void {
    if (url[0] === '/') {
      url = url.substring(1);
    }
    url = url.replace('/', '_');
    // console.log('deleteRouteSnapshot:', url);
    if (AppReuseStrategy.routeCache.has(url)) {
      AppReuseStrategy.routeCache.delete(url);
      AppReuseStrategy.currentDelete = url;
    } else {
      AppReuseStrategy.waitDelete = url;
    }
  }
}