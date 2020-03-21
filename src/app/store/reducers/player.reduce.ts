import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { Song } from 'src/app/services/dataTypes/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetPlayMode, SetSongList, SetCurrentIndex } from '../actions/play.action';

export type PlayState = {
    // 播放状态
    playing: boolean;
    // 播放模式
    playMode: PlayMode;
    // 歌曲列表
    songList: Song[];
    // 播放列表
    playList: Song[];
    // 当前正在播放的索引
    currentIndex: number;
}

// 初始状态
export const initialState: PlayState = {
    playing: false,
    playMode: { type: 'loop', label: '循环' },
    songList: [],
    playList: [],
    currentIndex: -1 //不知道默认播放哪一首
}

// 注册动作
const reducer = createReducer(
    initialState,
    on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
    on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
    on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
    on(SetSongList, (state, { songList }) => ({ ...state, songList })),
    on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex }))
)

export function playerReducer(state: PlayState, action: Action) {
    return reducer(state, action);
}
