import { TAKE_CARDS } from './logic/actions';
import {
    takeCardsFromSearch,
    downCreatureCards,
    downSongCard,
    discardToSearch,
    discardToEndTurn,
    takeCardFromDiscard,
    selectCardFromDiscard,
    goblinCardExecute,
    koboldCardExecute,
    trollCardExecute,
    springSongCardExecute,
    autumnSongCardSelectPlayer,
    autumnSongCardExecute,
    winterSongCardExecute,
} from './logic/moves';
import { initializeDeck, initializeGarden } from './logic/initializer';
import { AUTUMN_SONG, SUMMER_SONG_ACTIVE_VALUE, DWARF, GNOME, GOBLIN, GROUPS, KOBOLD, MIMIC, SUMMER_SONG, TROLL, WINTER_SONG } from './logic/cards';
import { calculatePlayerScore } from './logic/utils';

export const EncantadosGame = {
    name: 'encantados-cardgame-online',
    setup: ({ random, ctx }) => {
        return ({
            deck: initializeDeck({ random }),
            alert: '',
            deckDiscardSearch: [WINTER_SONG, MIMIC, DWARF, WINTER_SONG, MIMIC, DWARF, WINTER_SONG, MIMIC],
            deckDiscardEndTurn: [TROLL, GNOME],
            tempDeck: [],
            garden: initializeGarden(ctx.numPlayers),
            hand: Array(ctx.numPlayers).fill([GNOME, GNOME]),
            currentAction: TAKE_CARDS,
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
            G.alert = 'Faça uma compra ou pegue uma carta das pilhas do descarte.';
        },
        onMove: ({ G, ctx, events }) => {
            // each move  
        },
        stages: {
            takeCards: {
                moves: { takeCardsFromSearch, takeCardFromDiscard, selectCardFromDiscard }
            },
            discardCards: {
                moves: { discardToSearch }
            },
            downCards: {
                moves: { downCreatureCards, downSongCard, discardToEndTurn },
            },
            idle: {
                moves: {}
            },
            goblinCard: {
                moves: { goblinCardExecute }
            },
            koboldCard: {
                moves: { koboldCardExecute }
            },
            trollCard: {
                moves: { trollCardExecute }
            },
            springSongCard: {
                moves: { springSongCardExecute, takeCardsFromSearch }
            },
            autumnSongCard: {
                moves: { autumnSongCardSelectPlayer, autumnSongCardExecute }
            },
            winterSongCard: {
                moves: { winterSongCardExecute, takeCardsFromSearch }
            },
        }
    },
    endIf: ({ G, ctx }) => {
        if (!G.hand[ctx.currentPlayer].length) {
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