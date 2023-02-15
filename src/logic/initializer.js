import { AUTUMN_SONG, cards, DWARF, ELF, GROUPS, MIMIC, SPRING_SONG, TROLL, WINTER_SONG } from './cards';

export function initializeGarden(numberPlayers) {
    const gardens = Array(numberPlayers);
    for (let i = 0; i + 1 <= numberPlayers; i++) {
        gardens[i] = {
            [GROUPS.dwarves]: [DWARF],
            [GROUPS.elves]: i === 0 ? [ELF, ELF, ELF] : [],
            [GROUPS.trolls]: [],
            [GROUPS.songs]: [],
        };

        // Object.values(GROUPS).map(i => {
        //    return { [i]: [] }
        // })
    }
    return gardens;
}

export function initializeDeck({ random }) {
    const deck = []
    // cards.forEach(c => { deck.push(c); deck.push(c); deck.push(c); });
    // cards.forEach(c => { deck.push(c); });
    deck.push(TROLL);
    deck.push(TROLL);
    deck.push(MIMIC);
    deck.push(SPRING_SONG);
    deck.push(AUTUMN_SONG);
    deck.push(WINTER_SONG);
    deck.push(DWARF);
    deck.push(DWARF);
    deck.push(DWARF);
    deck.push(ELF);
    deck.push(MIMIC);
    deck.push(ELF);
    return deck;
    //return random.Shuffle(deck);
}