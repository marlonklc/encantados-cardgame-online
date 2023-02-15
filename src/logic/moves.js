import { CARD_AUTUMN_SONG, CARD_AUTUMN_SONG_EXECUTE, CARD_SPRING_SONG, CARD_WINTER_SONG, DISCARD_CARD, DOWN_CARDS, 
    SELECT_CARD_FROM_END_TURN_DISCARD, SELECT_CARD_FROM_SEARCH_DISCARD, TAKE_CARDS } from './actions';
import { GROUPS } from './cards';

export function takeCardsFromSearch({ G, playerID, events }, toPlayer = playerID) {
    if (!G.deck.length) return;

    const hasElvesOnGarden = hasCreatureOnGarden(G.garden[playerID], GROUPS.elves);
    if (hasElvesOnGarden) {
        G.tempDeck.push(G.deck.pop());
    }

    G.tempDeck.push(G.deck.pop());
    G.tempDeck.push(G.deck.pop());

    G.playerSourceAction = playerID;
    G.currentAction = DISCARD_CARD;
    G.showModal[toPlayer] = true;

    events.setActivePlayers({
        value: {
            [toPlayer]: 'discardCards'
        }
    });
}

export function discardToSearch({ G, playerID, events }, selectedIndex) {
    G.hand[playerID].push(G.tempDeck.splice(selectedIndex, 1)[0]);
    G.deckDiscardSearch = G.deckDiscardSearch.concat(G.tempDeck);
    G.tempDeck = [];
    G.currentAction = DOWN_CARDS;
    G.showModal[playerID] = false;

    events.setActivePlayers({
        value: {
            [G.playerSourceAction]: 'downCards'
        }
    });

    G.playerSourceAction = undefined;
}

export function takeCardFromDiscard({ G, playerID, events }, deckOfDiscard) {
    const hasDwarvesOnGarden = hasCreatureOnGarden(G.garden[playerID], GROUPS.dwarves);

    if (deckOfDiscard === 'search') {
        if (!G.deckDiscardSearch.length) return;

        if (hasDwarvesOnGarden) {
            G.currentAction = SELECT_CARD_FROM_SEARCH_DISCARD;
            G.showModal[playerID] = true;
            return;
        }

        G.hand[playerID].push(G.deckDiscardSearch.pop());
    }

    if (deckOfDiscard === 'endTurn') {
        if (!G.deckDiscardEndTurn.length) return;

        if (hasDwarvesOnGarden) {
            G.currentAction = SELECT_CARD_FROM_END_TURN_DISCARD;
            G.showModal[playerID] = true;
            return;
        }

        G.hand[playerID].push(G.deckDiscardEndTurn.pop());
    }

    G.currentAction = DOWN_CARDS;
    events.setStage('downCards');
}

export function selectCardFromDiscard({ G, playerID, events }, deckOfDiscard, index) {
    if (deckOfDiscard === 'search') {
        G.hand[playerID].push(G.deckDiscardSearch.splice(index, 1)[0]);
    }

    if (deckOfDiscard === 'endTurn') {
        G.hand[playerID].push(G.deckDiscardEndTurn.splice(index, 1)[0]);
    }
    
    G.showModal[playerID] = false;
    G.currentAction = DOWN_CARDS;
    events.setStage('downCards');
}

export function downCreatureCards({ G, playerID }, cards = []) {
    if (cards.length < 3) {
        G.alert = 'nao pode menos que tres cartas';
        return;
    }

    G.playerAlreadyDownedCreatureCard = true;

    cards.forEach(card => {
        G.garden[playerID].trolls.push(card);
        const index = G.hand[playerID].indexOf(card);
        G.hand[playerID].splice(index, 1);
    });
}

export function downSongCard({ G, playerID, events }, card) {
    G.playerAlreadyDownedSongCard = true;

    if (card.action === CARD_SPRING_SONG) {
        G.currentAction = CARD_SPRING_SONG;
        G.showModal[playerID] = true;
        events.setStage('springSongCard');
    } else if (card.action === CARD_AUTUMN_SONG) {
        G.showModal[playerID] = true;
        G.currentAction = CARD_AUTUMN_SONG;
        events.setStage('autumnSongCard');
    } else if (card.action === CARD_WINTER_SONG) {
        G.showModal[playerID] = true;
        G.currentAction = CARD_WINTER_SONG;
        events.setStage('winterSongCard');
    }

    G.garden[playerID].songs.push(card);
    G.hand[playerID].splice(card.index, 1);
}

export function discardToEndTurn({ G, playerID, events, }, index) {
    G.deckDiscardEndTurn.push(G.hand[playerID].splice(index, 1)[0]);

    G.currentAction = TAKE_CARDS;
    G.playerAlreadyDownedSongCard = false;
    G.playerAlreadyDownedCreatureCard = false;

    events.endTurn();
    events.setStage('takeCards');
}

export function springSongCardExecute({ G, playerID, events }, toPlayer) {
    if (playerID !== toPlayer) {
        G.showModal[playerID] = false;
    }

    takeCardsFromSearch({ G, playerID, events }, toPlayer);
}

export function autumnSongCardSelectPlayer({ G, playerID, events }, toPlayer) {
    if (!G.deckDiscardSearch.length && !G.deckDiscardEndTurn.length) {
        G.currentAction = DOWN_CARDS;
        G.showModal[playerID] = false;
        return;
    }

    if (playerID !== toPlayer) {
        G.showModal[playerID] = false;
        G.showModal[toPlayer] = true;
    }

    G.currentAction = CARD_AUTUMN_SONG_EXECUTE;
    G.playerSourceAction = playerID;

    events.setActivePlayers({
        value: {
            [toPlayer]: 'autumnSongCard'
        },
        maxMoves: 1,
    });
}

export function autumnSongCardExecute({ G, playerID, events }, deckOfDiscard) {
    if (deckOfDiscard === 'search') {
        G.hand[playerID] = G.hand[playerID].concat(G.deckDiscardSearch.splice(-4, 4));
    }

    if (deckOfDiscard === 'endTurn') {
        G.hand[playerID] = G.hand[playerID].concat(G.deckDiscardEndTurn.splice(-4, 4));
    }

    G.showModal[playerID] = false;
    G.playerSourceAction = undefined;
    G.currentAction = DOWN_CARDS;

    events.setActivePlayers({ currentPlayer: 'downCards' });
}

export function winterSongCardExecute({ G, playerID, events }, deckOfDiscard) {
    if (deckOfDiscard === 'search') {
        G.hand[playerID] = G.hand[playerID].concat(G.deckDiscardSearch.splice(-1, 1));
    } 

    if (deckOfDiscard === 'endTurn') {
        G.hand[playerID] = G.hand[playerID].concat(G.deckDiscardEndTurn.splice(-1, 1));
    }

    takeCardsFromSearch({ G, playerID, events });
}

function hasCreatureOnGarden(garden, creatureGroup) {
    return garden[creatureGroup].filter(card => card.group === creatureGroup).length >= 2;
}