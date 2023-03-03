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
} from './logic/moves';
import { initializeDeck, initializeGarden, initializePlayersHand } from './logic/initializer';
import { calculatePlayerScore } from './logic/utils';
import { GAME_NAME } from './config';

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
                moves: { downCreatureCards, expandCreatureCards, downSongCard, discardToEndTurn },
            },
            idle: {
                moves: {}
            },
            goblinCard: {
                moves: { goblinCardExecute }
            },
            koboldCard: {
                moves: { koboldCardExecute, skipKoboldCardExecute }
            },
            trollCard: {
                moves: { trollCardExecute, skipTrollCardExecute }
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