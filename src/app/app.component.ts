import {Component, OnInit, Output, Renderer2} from '@angular/core';
import {environment} from '../environments/environment';
import {ActivatedRoute, Event as RouterEvent, NavigationEnd, Router} from '@angular/router';
import {LoaderService} from './shared/services/loader/loader.service';
import {Store} from '@ngrx/store';
import {localStorageKeys, State} from './core/modules/core-store/core-store.model';
import {Storage} from './core/modules/core-store/core-store.action';
import {CoreContextService} from './core/modules/core-context/core-context.service';
import {defer} from 'lodash';

@Component({
  selector: 'ece-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Espace Client Pro';
  environmentName = environment.envName;

  public showLoader: boolean = false;
  public showIfnotUlyss: boolean = false;
  public loaded = false;
  public loaderText: string;
  @Output()
  public pageTitle: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loaderService: LoaderService,
              private readonly renderer: Renderer2,
              private readonly store: Store<State>,
              private context: CoreContextService) {
  }

  ngOnInit() {
    this.renderer.listen('window', 'storage', event => {
      // Checks if storage updated key is part of core state
      const isCoreStateKey = localStorageKeys.indexOf(event.key) > -1;

      // IE dispatches storage event on source and target windows
      // we can only check if the value has been changed to identify cross-tab actions
      const isCrossTabUpdate = event.oldValue !== event.newValue;

      if (isCoreStateKey && isCrossTabUpdate) {
        // Because IE fires storage event BEFORE updating storage
        // we defer the local storage update action
        defer(e => {
          const newValue = e.newValue ? JSON.parse(e.newValue) : undefined;
          this.store.dispatch(new Storage({
            key: e.key,
            value: newValue
          }));
        }, event);
      }
    });

    this.loaded = true;

    // temp workaround for bad url from lagon
    // TODO remove once lagon redirection is fixed
    this.context.initialize();

    this.loaderService.status.subscribe((datas: any) => {
      this.showLoader = datas.value;
      this.loaderText = datas.text;
    });

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }
        this.pageTitle = currentRoute.snapshot.data;
        this.showIfnotUlyss = !(event.url.indexOf('intranet') > -1 || event.url.indexOf('erreur') > -1 || event.url === '/');
      }
    });
  }
}
