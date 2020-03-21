import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/dataTypes/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/play.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];
  @ViewChild(NzCarouselComponent, { static:true }) private nzCarousel: NzCarouselComponent;

  constructor(
    // private homeServe: HomeService,
    // private singerServe: SingerService,
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private store$: Store<AppStoreModule>
  ) { 
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      banners.forEach(x => {
        x.url === null ? x.url = 'http://danzo.top' : x.url;
      })
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
      
    });
    // this.getBanners();
    // this.getHotTags();
    // this.getPersonalSheetList();
    // this.getEnterSingers();
  }

  // private getBanners() {
  //   this.homeServe.getBanners().subscribe(banners => {
  //     banners.forEach(x => {
  //       x.url === null ? x.url = 'http://danzo.top' : x.url;
  //     })
  //     this.banners = banners;
  //   });
  // }

  // private getHotTags() {
  //   this.homeServe.getHotTags().subscribe(tags => {
  //     this.hotTags = tags;
  //   });
  // }

  // private getPersonalSheetList() {
  //   this.homeServe.getPersonalSheetList().subscribe(sheets => {
  //     this.songSheetList = sheets;
  //   });
  // }

  // private getEnterSingers() {
  //   this.singerServe.getEnterSinger().subscribe(singers => {
  //     this.singers = singers;
  //   });
  // }

  ngOnInit(): void {
  }

  onBeforeChange({ to }) {
    // console.log('to:', to);
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: string) {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    console.log('id', id);
    this.sheetServe.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({ songList: list }));
      this.store$.dispatch(SetPlayList({ playList: list }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
    })
  }

}
