export const VOLUME = {
    HIGH: .8,
    MEDIUM: .5,
    LOW: .1,
};

export const AUDIOS = {
    TAKE_CARDS_FROM_SEARCH: { file: '/audios/card-flip2.mp3', volume: .5 },
    TAKE_CARDS_FROM_DISCARD: { file: '/audios/card-flip1.mp3', volume: .3 },
    PUT_CARDS_ON_HAND: { file: '/audios/card-flip4.mp3', volume: .3 },
    PLAYER_START_TURN: { file: '/audios/player-turn-1.mp3', volume: .3 },
    PLAYER_END_TURN: { file: '/audios/player-end-turn.mp3', volume: .2 },
    DOWN_CREATURE_CARDS: { file: '/audios/down-creature-cards.mp3', volume: .2 },
    DOWN_SONG_CARD: { file: '/audios/down-song-card.mp3', volume: .3 },
    ALERT_PLAYER: { file: '/audios/alert-choosed-player.mp3', volume: .5 },
};

export function playAudio(path, volume = VOLUME.HIGH) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play();
    return audio;
}