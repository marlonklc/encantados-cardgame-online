import {
    CARD_AUTUMN_SONG, CARD_AUTUMN_SONG_EXECUTE, CARD_GOBLIN_CREATURE, CARD_KOBOLD_CREATURE,
    CARD_SPRING_SONG, CARD_TROLL_CREATURE, CARD_WINTER_SONG, DISCARD_CARD, DOWN_CARDS,
    SELECT_CARD_FROM_END_TURN_DISCARD, SELECT_CARD_FROM_SEARCH_DISCARD, TAKE_CARDS
} from './actions';
import { GROUPS } from './cards';
import _ from 'lodash';
import { isAbleDownCreatures, isAbleExpandCreatures, isCreatureAbilityEnabled, sortCardsIndex as sortCardsByIndex, sortHandByGroups } from './utils';
import { AUDIOS } from './audio';

export function takeCardsFromSearch({ G, playerID, events }, toPlayer = playerID) {
    const hasGnomesOnGarden = isCreatureAbilityEnabled(G.garden[toPlayer], GROUPS.gnomes);
    if (hasGnomesOnGarden) {
        G.hand[toPlayer].forEach(card => G.tempDeck.push(card));
    }

    const hasElvesOnGarden = isCreatureAbilityEnabled(G.garden[toPlayer], GROUPS.elves);
    if (hasElvesOnGarden) {
        G.tempDeck.push(G.deck.pop());
    }
    G.tempDeck.push(G.deck.pop());
    G.tempDeck.push(G.deck.pop());

    const hasNoEnoughCardsOnDeck = !G.deck.length;
    if (hasNoEnoughCardsOnDeck) return;

    G.audio[0] = AUDIOS.TAKE_CARDS_FROM_SEARCH;
    G.audio[1] = AUDIOS.TAKE_CARDS_FROM_SEARCH;
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
    const hasElvesOnGarden = isCreatureAbilityEnabled(G.garden[playerID], GROUPS.elves);

    if (hasElvesOnGarden && cards.length > 2) return;
    if (!hasElvesOnGarden && cards.length > 1) return;

    // I have no idea why filter() doesnt work with G variables, it always keep the same array length and same objects.
    // Because of that I used this workaround
    let count = 0;
    sortCardsByIndex(cards).forEach(index => {
        const newIndex = index !== 0 ? index - count : 0;
        G.tempDeck.splice(newIndex, 1);
        count++;
    });

    const hasGnomesOnGarden = isCreatureAbilityEnabled(G.garden[playerID], GROUPS.gnomes);

    if (hasGnomesOnGarden) {
        G.hand[playerID] = G.tempDeck;
    } else {
        G.hand[playerID].push(G.tempDeck[0]);
    }

    G.hand[playerID] = sortHandByGroups(G.hand[playerID]);
    G.deckDiscardSearch = G.deckDiscardSearch.concat(cards);
    G.tempDeck = [];
    G.audio[0] = AUDIOS.TAKE_CARDS_FROM_SEARCH;
    G.audio[1] = AUDIOS.TAKE_CARDS_FROM_SEARCH;
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
    const hasDwarvesOnGarden = isCreatureAbilityEnabled(G.garden[playerID], GROUPS.dwarves);

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

    G.audio[0] = AUDIOS.TAKE_CARDS_FROM_DISCARD;
    G.audio[1] = AUDIOS.TAKE_CARDS_FROM_DISCARD;
    G.hand[playerID] = sortHandByGroups(G.hand[playerID]);
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

    G.hand[playerID] = sortHandByGroups(G.hand[playerID]);
    G.showModal[playerID] = false;
    G.currentAction = DOWN_CARDS;
    events.setStage('downCards');
}

export function downCreatureCards({ G, playerID, events }, cards = []) {
    if (!isAbleDownCreatures(G, playerID, cards)) {
        G.alert = 'Não é possível baixar as criaturas';
        return;
    }

    G.playerAlreadyDownedCreatureCard = true;

    downCreatureOnGarden(G, playerID, events, cards);
}

export function expandCreatureCards({ G, playerID, events }, enemyPlayerID, cards = []) {
    if (!isAbleExpandCreatures(G, playerID, enemyPlayerID, cards)) {
        G.alert = 'Não é possível baixar as criaturas';
        return;
    }

    downCreatureOnGarden(G, playerID, events, cards);
}

function downCreatureOnGarden(G, playerID, events, cards) {
    const grouped = _.groupBy(cards, c => c.group);
    let groupOfCards = Object.keys(grouped).filter(k => k !== 'undefined')[0];

    // I have no idea why filter() doesnt work with G variables, it always keep the same array length and same objects.
    // Because of that I used this workaround
    let count = 0;
    sortCardsByIndex(cards).forEach(index => {
        const newIndex = index !== 0 ? index - count : 0;
        const removedCard = G.hand[playerID].splice(newIndex, 1)[0];
        G.garden[playerID][groupOfCards].push(removedCard);
        count++;
    });

    G.audio[0] = AUDIOS.DOWN_CREATURE_CARDS;
    G.audio[1] = AUDIOS.DOWN_CREATURE_CARDS;

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
    if (!card) return;

    const playerHasNotEnoughCards = (G.hand[playerID].length - 1) <= 0;
    if (playerHasNotEnoughCards) return;

    G.playerAlreadyDownedSongCard = true;
    G.garden[playerID].songs.push(card);
    G.hand[playerID].splice(card.index, 1);
    G.audio[0] = AUDIOS.DOWN_SONG_CARD;
    G.audio[1] = AUDIOS.DOWN_SONG_CARD;

    if (card.action === CARD_SPRING_SONG) {
        G.currentAction = CARD_SPRING_SONG;
        G.showModal[playerID] = true;
        events.setStage('springSongCard');
    } else if (card.action === CARD_AUTUMN_SONG) {
        if (!G.deckDiscardSearch.length && !G.deckDiscardEndTurn.length) {
            return;
        }

        G.showModal[playerID] = true;
        G.currentAction = CARD_AUTUMN_SONG;
        events.setStage('autumnSongCard');
    } else if (card.action === CARD_WINTER_SONG) {
        if (!G.deckDiscardSearch.length && !G.deckDiscardEndTurn.length) {
            takeCardsFromSearch({ G, playerID, events });
            return;
        }

        G.showModal[playerID] = true;
        G.currentAction = CARD_WINTER_SONG;
        events.setStage('winterSongCard');
    }
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

    G.hand[toPlayer] = sortHandByGroups(G.hand[toPlayer]);
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

export function skipKoboldCardExecute({ G, playerID, events }) {
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

            if (!!group[1].length && !mimicCards.length) {
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

export function skipTrollCardExecute({ G, playerID, events }) {
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

    G.hand[playerID] = sortHandByGroups(G.hand[playerID]);
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

export function resetAudio({ G, playerID, events }) {
    G.audio[playerID] = undefined;
}