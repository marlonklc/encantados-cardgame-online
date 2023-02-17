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
import { DWARF, GNOME, GOBLIN, KOBOLD, MIMIC, TROLL, WINTER_SONG } from './logic/cards';

export const Game = {
    name: 'encantados-cardgame-online',
    setup: ({ random, ctx }) => {
        return ({
            deck: initializeDeck({ random }),
            alert: '',
            deckDiscardSearch: [WINTER_SONG, MIMIC, DWARF],
            deckDiscardEndTurn: [TROLL],
            tempDeck: [],
            garden: initializeGarden(ctx.numPlayers),
            hand: Array(ctx.numPlayers).fill([KOBOLD, KOBOLD, MIMIC]),
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
    moves: {

    },
    endIf: ({ G, ctx }) => {
        // if (isVictory(G.cells)) return { winner: ctx.currentPlayer };
        // if (isDraw(G.cells)) return { draw: true };
    },
};