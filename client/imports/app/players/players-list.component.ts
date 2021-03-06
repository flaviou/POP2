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
  sortCriteria: Subject<string[]> = new Subject<string[]>();

  constructor(
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.sortCriteria
    ).subscribe(([pageSize, curPage, nameOrder, sortCriteria]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { [sortCriteria]: nameOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.playersSub) {
        this.playersSub.unsubscribe();
      }
      
      this.playersSub = MeteorObservable.subscribe('players', options).subscribe(() => {
        var sortCriteriaDoc = {};
        switch (sortCriteria[0]) {
          case "TeamName":
            sortCriteriaDoc = {TeamName: nameOrder, LastName: 1, FirstName: 1};
            break;
          case "LastName":
            sortCriteriaDoc = {LastName: nameOrder, FirstName: 1};
            break;
          case "RegularSeason.Points":
            sortCriteriaDoc = {"RegularSeason.Points": nameOrder, TeamName: 1, LastName: 1, FirstName: 1};
            break;
          case "Position":
            sortCriteriaDoc = {Position: nameOrder, TeamName: 1, LastName: 1, FirstName: 1};
            break;
        }
        this.players = Players.find({}, {
          sort: sortCriteriaDoc
          }).zone();      
      });
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 25,
      currentPage: 1,
      totalItems: this.playersSize
    });

    this.pageSize.next(25);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.sortCriteria.next(["TeamName"]);

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

  changeOrder(value: boolean): void {
    this.nameOrder.next(value ? 1 : -1);
  }

  changeSort(sortBy: string): void {
    this.sortCriteria.next([sortBy]);
  }

  ngOnDestroy() {
    this.playersSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }
}
