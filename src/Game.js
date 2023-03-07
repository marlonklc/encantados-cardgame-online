import { TAKE_CARDS } from './logic/actions';
import {
    takeCardsFromSearch,
    downCreatureCards,
    expandCreatureCards,
    downSongCard,
    discardToSearch,
    discardToEndTurn,
    takeCardFromDiscard,
    selectCardFromDiscard,
    goblinCardExecute,
    koboldCardExecute,
    skipKoboldCardExecute,
    trollCardExecute,
    skipTrollCardExecute,
    springSongCardExecute,
    autumnSongCardSelectPlayer,
    autumnSongCardExecute,
    winterSongCardExecute,
    resetAudio,
} from './logic/moves';
import { initializeDeck, initializeGarden, initializePlayersHand } from './logic/initializer';
import { calculatePlayerScore } from './logic/utils';
import { GAME_NAME } from './config';
import { AUDIOS } from './logic/audio';

export const EncantadosGame = {
    name: GAME_NAME,
    setup: ({ random, ctx }) => {
        const deck = initializeDeck({ random });
        return ({
            deck,
            alert: '',
            deckDiscardSearch: [],
            deckDiscardEndTurn: [],
            tempDeck: [],
            hand: initializePlayersHand(ctx, deck),
            garden: initializeGarden(ctx.numPlayers),
            currentAction: TAKE_CARDS,
            audio: Array(ctx.numPlayers).fill(undefined),
            goblinCardAlreadyPlayed: Array(ctx.numPlayers).fill(false),
            koboldCardAlreadyPlayed: Array(ctx.numPlayers).fill(false),
            trollCardAlreadyPlayed: Array(ctx.numPlayers).fill(false),
            playerAlreadyDownedSongCard: false,
            playerAlreadyDownedCreatureCard: false,
            playerSourceAction: undefined,
            showModal: Array(ctx.numPlayers).fill(false),
        })
    },
    turn: {
        minMoves: 2,
        activePlayers: { currentPlayer: 'takeCards' },
        onEnd: ({ G, ctx }) => {
            // end turn
        },
        onBegin: ({ G, ctx }) => {
            if (ctx.turn !== 1) {
                G.audio[ctx.currentPlayer] = AUDIOS.PLAYER_START_TURN;
            }
        },
        onMove: ({ G, ctx, events }) => {
            // each move  
        },
        stages: {
            takeCards: {
                moves: { takeCardsFromSearch, takeCardFromDiscard, selectCardFromDiscard, resetAudio }
            },
            discardCards: {
                moves: { discardToSearch, resetAudio }
            },
            downCards: {
                moves: { downCreatureCards, expandCreatureCards, downSongCard, discardToEndTurn, resetAudio },
            },
            idle: {
                moves: { resetAudio }
            },
            goblinCard: {
                moves: { goblinCardExecute, resetAudio }
            },
            koboldCard: {
                moves: { koboldCardExecute, skipKoboldCardExecute, resetAudio }
            },
            trollCard: {
                moves: { trollCardExecute, skipTrollCardExecute, resetAudio }
            },
            springSongCard: {
                moves: { springSongCardExecute, takeCardsFromSearch, resetAudio }
            },
            autumnSongCard: {
                moves: { autumnSongCardSelectPlayer, autumnSongCardExecute, resetAudio }
            },
            winterSongCard: {
                moves: { winterSongCardExecute, takeCardsFromSearch, resetAudio }
            },
        }
    },
    endIf: ({ G, ctx }) => {
        if (!G.hand[ctx.currentPlayer].length || !G.deck.length) {
            const player0Score = calculatePlayerScore(G, 0);
            const player1Score = calculatePlayerScore(G, 1);

            return {
                score: {
                    0: player0Score,
                    1: player1Score
                },
                winner: player0Score > player1Score ? 0 : player1Score > player0Score ? 1 : undefined,
                gameover: true,
            };
        }
    },
};