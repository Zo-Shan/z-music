import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongSheet, Song } from './dataTypes/common.types';
import queryString from 'query-string';
import { SongService } from './song.service';

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri:string,
    private songServe: SongService
  ) { }


  getSongSheetDetail(id: number):Observable<SongSheet[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params }).pipe(map((res: { playlist: SongSheet[] }) => res.playlist));
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'), switchMap((tracks: Song | Song[]) => this.songServe.getSongList(tracks)));
  }

}
