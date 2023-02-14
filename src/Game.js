import { TAKE_CARDS } from './logic/actions';
import { 
    takeCardsFromSearch,
    downCreatureCards,
    downSongCard,
    discardToSearch,
    discardToEndTurn,
    takeCardFromSearchDiscard,
    takeCardFromEndTurnDiscard,
    springSongCardExecute,
    autumnSongCardSelectPlayer,
    autumnSongCardExecute,
    winterSongCardExecute,
} from './logic/moves';
import { initializeDeck, initializeGarden } from './logic/initializer';
import { DWARF, MIMIC, TROLL } from './logic/cards';

export const Game = {
    name: 'encantados-cardgame-online',
    setup: ({ random, ctx }) => {
        return ({
            deck: initializeDeck({ random }),
            alert: '',
            deckDiscardSearch: [MIMIC, MIMIC, MIMIC, MIMIC, MIMIC, DWARF],
            deckDiscardEndTurn: [TROLL, TROLL, TROLL, TROLL, TROLL, TROLL],
            tempDeck: [],
            garden: initializeGarden(ctx.numPlayers),
            hand: Array(ctx.numPlayers).fill([]),
            currentAction: TAKE_CARDS,
            playerAlreadyDownedSongCard: false,
            playerAlreadyDownedCreatureCard: false,
            playerSourceAction: undefined,
            showModal: Array(ctx.numPlayers).fill(false),
        })
    },
    turn: {
        minMoves: 2,
        activePlayers: { currentPlayer: 'takeCards' },
        onEnd: ({G, ctx}) => {
            //checkForWinner(G);
        },
        onBegin: ({G, ctx}) => {
            G.alert = 'Faça uma compra ou pegue uma carta das pilhas do descarte.';
        },
        onMove: ({G, ctx, events}) => {

        },
        stages: {
            takeCards: {
                moves: { takeCardsFromSearch, takeCardFromSearchDiscard, takeCardFromEndTurnDiscard }
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
    moves: {

    },
    endIf: ({ G, ctx }) => {
        // if (isVictory(G.cells)) return { winner: ctx.currentPlayer };
        // if (isDraw(G.cells)) return { draw: true };
    },
};