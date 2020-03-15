import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of, EMPTY, forkJoin }  from 'rxjs';
import { first }         from 'rxjs/operators';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { HotTag, SongSheet, Singer, Banner } from 'src/app/services/dataTypes/common.types';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe: HomeService,
    private singerServe: SingerService
  ) {}

  resolve(): Observable<HomeDataType> {
    return forkJoin([
        this.homeServe.getBanners(),
        this.homeServe.getHotTags(),
        this.homeServe.getPersonalSheetList(),
        this.singerServe.getEnterSinger()
    ]).pipe(first());
  }
}