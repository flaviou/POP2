import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { InjectUser } from "angular2-meteor-accounts-ui";

import 'rxjs/add/operator/combineLatest';

import { Players } from '../../../../both/collections/players.collection';
import { Player } from '../../../../both/models/player.model';

import template from './players-list.component.html';
import style from './players-list.component.scss';
import pipe from './players-list.pipe.ts';

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: 'players-list',
  template,
  styles: [ style ]
})
@InjectUser('user')
export class PlayersListComponent implements OnInit, OnDestroy {
  players: Observable<Player[]>;
  playersSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  playersSize: number = 0;
  autorunSub: Subscription;
  user: Meteor.User;

  constructor(
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder
    ).subscribe(([pageSize, curPage, nameOrder]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.playersSub) {
        this.playersSub.unsubscribe();
      }
      
      this.playersSub = MeteorObservable.subscribe('players', options).subscribe(() => {
        this.players = Players.find().zone();      
      });
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.playersSize
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.nameOrder.next(1);

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.playersSize = Counts.get('numberOfPlayers');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.playersSize);
    });
  }

  search(value: string): void {
    this.curPage.next(1);
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }

  ngOnDestroy() {
    this.playersSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }
}
