import {
    CARD_AUTUMN_SONG, CARD_AUTUMN_SONG_EXECUTE, CARD_GOBLIN_CREATURE, CARD_KOBOLD_CREATURE, CARD_SPRING_SONG, CARD_TROLL_CREATURE, CARD_WINTER_SONG, DISCARD_CARD, DOWN_CARDS,
    SELECT_CARD_FROM_END_TURN_DISCARD, SELECT_CARD_FROM_SEARCH_DISCARD, TAKE_CARDS
} from './actions';
import { GROUPS } from './cards';
import _ from 'lodash';

export function takeCardsFromSearch({ G, playerID, events }, toPlayer = playerID) {
    if (!G.deck.length) return;

    const hasGnomesOnGarden = hasCreatureOnGarden(G.garden[playerID], GROUPS.gnomes);
    if (hasGnomesOnGarden) {
        G.hand[playerID].forEach(card => G.tempDeck.push(card));
    }

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

export function discardToSearch({ G, playerID, events }, cards) {
    const hasElvesOnGarden = hasCreatureOnGarden(G.garden[playerID], GROUPS.elves);

    if (hasElvesOnGarden && cards.length > 2) return;
    if (!hasElvesOnGarden && cards.length > 1) return;

    // I have no idea why filter() doesnt work with G variables, it always keep the same array length and same objects.
    // Because of that I used this workaround
    cards.map(c => c.index).sort().forEach(index => {
        const newIndex = index !== 0 ? index - 1 : 0;
        G.tempDeck.splice(newIndex, 1);
    });

    const hasGnomesOnGarden = hasCreatureOnGarden(G.garden[playerID], GROUPS.gnomes);

    if (hasGnomesOnGarden) {
        G.hand[playerID] = G.tempDeck;
    } else {
        G.hand[playerID].push(G.tempDeck[0]);
    }

    G.deckDiscardSearch = G.deckDiscardSearch.concat(cards);
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

export function downCreatureCards({ G, playerID, events }, cards = []) {
    if (!isAbleDownCreatures(G.garden[playerID], cards)) {
        G.alert = 'Não é possível baixar as criaturas';
        return;
    }

    const grouped = _.groupBy(cards, c => c.group);
    const groupOfCards = Object.keys(grouped).filter(k => k !== 'undefined')[0];

    G.playerAlreadyDownedCreatureCard = true;

    // I have no idea why filter() doesnt work with G variables, it always keep the same array length and same objects.
    // Because of that I used this workaround
    let count = 0;
    cards.map(c => c.index).sort().forEach(index => {
        const newIndex = index !== 0 ? index - count : 0;
        const removedCard = G.hand[playerID].splice(newIndex, 1)[0];
        G.garden[playerID][groupOfCards].push(removedCard);
        count++;
    });

    if (groupOfCards === GROUPS.goblins) {
        if (G.goblinCardAlreadyPlayed[playerID]) return;

        G.currentAction = CARD_GOBLIN_CREATURE;
        G.showModal[playerID] = true;
        events.setStage('goblinCard');
    }

    if (groupOfCards === GROUPS.kobolds) {
        if (G.koboldCardAlreadyPlayed[playerID]) return;

        G.currentAction = CARD_KOBOLD_CREATURE;
        G.showModal[playerID] = true;
        events.setStage('koboldCard');
    }

    if (groupOfCards === GROUPS.trolls) {
        if (G.trollCardAlreadyPlayed[playerID]) return;

        G.currentAction = CARD_TROLL_CREATURE;
        G.showModal[playerID] = true;
        events.setStage('trollCard');
    }
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

export function goblinCardExecute({ G, playerID, events }, toPlayer) {
    G.hand[toPlayer].push(G.deck.pop());
    G.hand[toPlayer].push(G.deck.pop());
    G.currentAction = DOWN_CARDS;
    G.showModal[playerID] = false;
    G.goblinCardAlreadyPlayed[playerID] = true;

    events.setStage('downCards');
}

export function koboldCardExecute({ G, playerID, events }, toPlayer, groupOfCard, index) {
    const cardRemoved = G.garden[toPlayer][groupOfCard].splice(index, 1)[0];

    G.deck.unshift(cardRemoved);
    G.currentAction = DOWN_CARDS;
    G.showModal[playerID] = false;
    G.koboldCardAlreadyPlayed[playerID] = true;

    events.setStage('downCards');
}

export function trollCardExecute({ G, playerID, events }, fromPlayer, groupOfCard, index, toPlayer) {
    const cardMoved = G.garden[fromPlayer][groupOfCard][index];

    if (!!cardMoved.group) {
        G.garden[toPlayer][cardMoved.group].push(cardMoved);
        G.garden[fromPlayer][groupOfCard].splice(index, 1);
    } else {
        _.forEach(Object.entries(G.garden[toPlayer]), (group) => {
            const mimicCards = group[1].filter(card => !card.group);

            if (group[1].length > 1 && !mimicCards.length) {
                G.garden[toPlayer][group[0]].push(cardMoved);
                G.garden[fromPlayer][groupOfCard].splice(index, 1);
                return false;
            }
        });
    }

    G.currentAction = DOWN_CARDS;
    G.showModal[playerID] = false;
    G.trollCardAlreadyPlayed[playerID] = true;
    events.setStage('downCards');
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

function isAbleDownCreatures(garden, cards) {
    const hasWispsOnGarden = garden[GROUPS.wisps].filter(card => card.group === GROUPS.wisps).length >= 2;

    const grouped = _.groupBy(cards, c => c.group);

    if (Object.keys(grouped).length > 2) return false;

    const mimics = Object.keys(grouped).filter(k => k === 'undefined').flatMap(k => grouped[k]);
    const leprechauns = Object.keys(grouped).filter(k => k === GROUPS.leprechauns).flatMap(k => grouped[k]);

    if (!!leprechauns.length && !!mimics.length) return false;
    if (mimics.length > 1) return false;

    return hasWispsOnGarden ? cards.length >= 2 : cards.length >= 3;
}

function hasCreatureOnGarden(garden, creatureGroup) {
    return garden[creatureGroup].filter(card => card.group === creatureGroup).length >= 2;
}