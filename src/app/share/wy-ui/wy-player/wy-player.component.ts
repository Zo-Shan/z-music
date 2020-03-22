import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong } from 'src/app/store/selectors/play.selector';
import { Song } from 'src/app/services/dataTypes/common.types';
import { PlayMode } from './player-type';
import { SetCurrentIndex, SetPlayMode, SetPlayList } from 'src/app/store/actions/play.action';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle } from 'src/app/utils/array';

const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  },
  {
    type: 'random',
    label: '随机'
  },
  {
    type: 'singleLoop',
    label: '单曲循环'
  }
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  percent = 0;
  bufferPercent = 0;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;

  // 是否可以播放
  songReady = false;

  // 音量
  volume: number = 60;

  // 是否显示音量面板
  showVolumePanel = false;

  // 是否点击音量面板本身
  selfClick = false;

  // 当前播放模式
  currentMode: PlayMode;
  modeCount = 0;

  private winClick: Subscription;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    const stateArr = [
      {
        type: getSongList,
        cb: list => this.watchList(list, 'songList')
      },
      {
        type: getPlayList,
        cb: list => this.watchList(list, 'playList')
      },
      {
        type: getCurrentIndex,
        cb: index => this.watchCurrentIndex(index)
      },
      {
        type: getPlayMode,
        cb: mode => this.watchPlayMode(mode)
      },
      {
        type: getCurrentSong,
        cb: song => this.watchCurrentSong(song)
      }
    ]
    stateArr.forEach((item: any) => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    })
  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    this.currentMode = mode;
    if(this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: list}));
      }
    }
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
    console.log('song:', song);
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = list.findIndex(item => item.id === song.id);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  // 改变模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({ playMode: temp }))
  }

  onPercentChange(per) {
    if(this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
    }
  }

  // 控制音量 
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100
  }

  // 控制音量面板
  togglePanel() {
    console.log(this.showVolumePanel);
    this.showVolumePanel = !this.showVolumePanel;
    if(this.showVolumePanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        // 点击了播放器以外的区域
        if (!this.selfClick) {
          this.showVolumePanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  // 控制音量面板
  toggleVolPanel(e: MouseEvent) {
    // e.stopPropagation();
    this.togglePanel();
  }

  // 播放/暂停
  onToggle() {
    if(!this.currentSong) {
      if(this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if(this.songReady) {
        this.playing = !this.playing;
        if(this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  // 上一首
  onPrev(index: number) {
    if(!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index <= 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一首
  onNext(index: number) {
    if(!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  // 播放结束
  onEnded() {
    this.playing = false;
    if(this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }

  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if(buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg'
  }
}
