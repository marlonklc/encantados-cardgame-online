import _ from 'lodash';
import { NONE } from './actions';
import { SUMMER_SONG_ACTIVE_VALUE, GROUPS } from './cards';

export function isCreatureAbilityEnabled(garden, creatureGroup) {
    return garden[creatureGroup].filter(card => card.group === creatureGroup).length >= 2;
}

export function calculatePlayerScore(G, playerID) {
    let score = 0;

    const hasFairiesAbility = isCreatureAbilityEnabled(G.garden[playerID], GROUPS.fairies);
    const hasFaunsAbility = isCreatureAbilityEnabled(G.garden[playerID], GROUPS.fauns);
    const hasLeprechaunsAbility = isCreatureAbilityEnabled(G.garden[playerID], GROUPS.leprechauns);
    const hasFiveOrMoreDifferentCreaturesOnGarden = Object.entries(G.garden[playerID])
        .filter(g => g[0] !== GROUPS.songs)
        .reduce((accumulator, group) => {
            const hasMinimiumOfCreaturesExcludingMimics = group[1].filter(card => card.group === group[0]).length >= 1;
            if (hasMinimiumOfCreaturesExcludingMimics) {
                return accumulator + 1;
            }

            return accumulator;
        }, 0) >= 5;

    if (hasFaunsAbility) {
        score += G.garden[playerID][GROUPS.songs].length * 2;
    }

    if (!!G.hand[playerID].length) {
        G.hand[playerID].forEach(card => {
            score += -Math.abs(card.value);
        });
    }

    const sumGroupCardPoints = (cards) => {
        return cards.reduce((accumulator, card) => {
            if (card.group === undefined && hasFairiesAbility) {
                return accumulator;
            }

            if (card.group === GROUPS.leprechauns && hasLeprechaunsAbility) {
                return accumulator + Math.abs(card.value);
            }

            if (card.group === GROUPS.songs && card.action === NONE && hasFiveOrMoreDifferentCreaturesOnGarden) {
                return accumulator + SUMMER_SONG_ACTIVE_VALUE;
            }

            return accumulator + card.value;
        }, 0);
    }

    const allCardsScore = Object.entries(G.garden[playerID])
        .reduce((accumulator, group) => {
            const cardGroupPoints = sumGroupCardPoints(group[1])

            return accumulator + cardGroupPoints;
        }, 0);

    return score + allCardsScore;
}

export function isAbleDownCreatures(garden, cards) {
    const hasWispsOnGarden = garden[GROUPS.wisps].filter(card => card.group === GROUPS.wisps).length >= 2;

    const grouped = _.groupBy(cards, c => c.group);

    if (Object.keys(grouped).length > 2) return false;

    const mimics = Object.keys(grouped).filter(k => k === 'undefined').flatMap(k => grouped[k]);
    const leprechauns = Object.keys(grouped).filter(k => k === GROUPS.leprechauns).flatMap(k => grouped[k]);

    const hasMimicsAmongLeprechauns = !!mimics.length && !!leprechauns.length;
    if (hasMimicsAmongLeprechauns) return false;

    const hasMoreThanOneMimic = mimics.length > 1;
    if (hasMoreThanOneMimic) return false;

    const hasIncompatibleCreatures = Object.keys(grouped).length === 2 && !mimics.length;
    if (hasIncompatibleCreatures) return false;

    return hasWispsOnGarden ? cards.length >= 2 : cards.length >= 3;
}