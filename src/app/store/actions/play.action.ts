import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/services/dataTypes/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';

// 设置播放状态
export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean }>());
// 设置播放列表
export const SetPlayList = createAction('[player] Set playList', props<{ playList: Song[] }>());
// 设置播放模式
export const SetPlayMode = createAction('[player] Set playMode', props<{ playMode: PlayMode }>());
// 设置歌曲列表
export const SetSongList = createAction('[player] Set songList', props<{ songList: Song[] }>());
// 设置当前正在播放的索引
export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ currentIndex: number }>());