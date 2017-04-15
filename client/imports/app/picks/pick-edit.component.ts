import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { InjectUser } from "angular2-meteor-accounts-ui";

import 'rxjs/add/operator/combineLatest';

import { Picks } from '../../../../both/collections/picks.collection';
import { Pick } from '../../../../both/models/pick.model';
import { Players } from '../../../../both/collections/players.collection';
import { Player } from '../../../../both/models/player.model';
import template from './pick-edit.component.html';
import style from './pick-edit.component.scss';

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: 'pick-edit',
  template,
  styles: [ style ]
})

@InjectUser('user')
export class PickEditComponent implements OnInit, OnDestroy {
  pickId: string;
  paramsSub: Subscription;
  pick: Pick;
  pickSub: Subscription;
  playersSize:number = 0;
  players: Observable<Player[]>;
  playersSub: Subscription;
  playerSingleSub: Subscription;
  pickPlayers: Observable<Player[]>;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  autorunSub: Subscription;
  user: Meteor.User;
  sortAsc: boolean = true;
  sortCriteria: Subject<string[]> = new Subject<string[]>();
  cMaxPlayers: number;
  cMaxPoints: number;
  selectedTeam: Subject<string> = new Subject<string>();

  constructor(
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
 
    this.cMaxPlayers = 20;
    this.cMaxPoints = 800;
    this.paramsSub = this.route.params
      .map(params => params['pickId'])
      .subscribe(pickId => {
        this.pickId = pickId;
        
        if (this.pickSub) {
          this.pickSub.unsubscribe();
        }

        this.pickSub = MeteorObservable.subscribe('pick', this.pickId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.pick = Picks.findOne(this.pickId);
            if (this.pick) {
              if (!this.pick.players) {
                var players = [];
                this.pick["players"] = players;
              }
            }
            
          });
        });
      });

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.sortCriteria,
      this.selectedTeam
    ).subscribe(([pageSize, curPage, nameOrder, sortCriteria, selectedTeam]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
 //       sort: { [sortCriteria]: nameOrder as number }
        sort: { [sortCriteria]: nameOrder as string }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.playersSub) {
        this.playersSub.unsubscribe();
      }
      var filterTeam = null;      
      this.playersSub = MeteorObservable.subscribe('players', options, selectedTeam).subscribe(() => {
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
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.playersSize
    });

    this.pageSize.next(100);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.sortCriteria.next(["TeamName"]);
    this.selectedTeam.next("Flames");

    if (this.autorunSub) {
      this.autorunSub.unsubscribe();
    }

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

  changeFilter(team: string): void {
    this.selectedTeam.next(team);
  }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.nameOrder.next(this.sortAsc ? 1 : -1);
  }

  numberOfPlayers(): number {
    if (this.pick) {
      if (this.pick.players) {
        return this.pick.players.length;
      }
    }
    return 0;
  }

  togglePlayer(thisPlayer: Player): void {
    if (!this.pick.players) {
      var players = [];
      this.pick["players"] = players;
    }
    if (this.isSelected(thisPlayer)) {
      this.pick.players = this.pick.players.filter(function(el) { return el.ID != thisPlayer.ID; })
      this.pick.RegularSeason.Goals -= parseInt(thisPlayer.RegularSeason.Goals);
      this.pick.RegularSeason.Assists -= parseInt(thisPlayer.RegularSeason.Assists);
      this.pick.RegularSeason.Points -= parseInt(thisPlayer.RegularSeason.Points);
    } else {
      if ((this.pick.players.length < this.cMaxPlayers) && (this.pick.RegularSeason.Points + parseInt(thisPlayer.RegularSeason.Points) <= this.cMaxPoints)) {
        this.pick.players.push(thisPlayer);
/*
        this.pick.RegularSeason.Goals += parseInt(thisPlayer.RegularSeason.Goals);
        this.pick.RegularSeason.Assists += parseInt(thisPlayer.RegularSeason.Assists);
        this.pick.RegularSeason.Points += parseInt(thisPlayer.RegularSeason.Points);
*/
        this.pick.RegularSeason.Goals += Number(thisPlayer.RegularSeason.Goals);
        this.pick.RegularSeason.Assists += Number(thisPlayer.RegularSeason.Assists);
        this.pick.RegularSeason.Points += Number(thisPlayer.RegularSeason.Points);
      }
    }
    return;
  }

  isSelected(thisPlayer: Player): Boolean {
    var result = $.grep(this.pick.players, function(e){ return e.ID == thisPlayer.ID;}); 
    return (result.length > 0);
  } 

  get isOwner(): boolean {
    return this.pick && this.user && this.user._id === this.pick.owner;
  }

  savePick() {
    if (!Meteor.userId()) {
      alert('Please log in to change this team');
      return;
    } else if (Meteor.userId() != this.pick.owner) {
      alert('Not authorized to modify change this team');
      return;
    }
    Picks.update(this.pick._id, {
      $set: {
        name: this.pick.name,
        players: this.pick.players,
        RegularSeason: this.pick.RegularSeason,
        Playoffs: this.pick.Playoffs
      }
    });
    this.router.navigate(['/']);
    return;
  }

  ngOnDestroy() {
    this.playersSub.unsubscribe();
    if (this.playerSingleSub) {
      this.playerSingleSub.unsubscribe();
    }
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.pickSub.unsubscribe();
  }
}
