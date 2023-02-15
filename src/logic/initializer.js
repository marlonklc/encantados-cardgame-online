import { AUTUMN_SONG, cards, DWARF, ELF, FAIRY, FAUN, GROUPS, LEPRECHAUN, MIMIC, SPRING_SONG, TROLL, WINTER_SONG, WISP } from './cards';

export function initializeGarden(numberPlayers) {
    const gardens = Array(numberPlayers);
    for (let i = 0; i + 1 <= numberPlayers; i++) {
        gardens[i] = {
            [GROUPS.dwarves]: [DWARF],
            [GROUPS.elves]: i === 0 ? [ELF, ELF, ELF] : [],
            [GROUPS.fairies]: i === 0 ? [FAIRY, FAIRY, FAIRY] : [],
            [GROUPS.fauns]: i === 0 ? [FAUN, FAUN, FAUN] : [],
            [GROUPS.leprechauns]: i === 1 ? [LEPRECHAUN, LEPRECHAUN] : [],
            [GROUPS.wisps]: i === 0 ? [WISP, WISP, WISP] : [],
            [GROUPS.trolls]: [],
            [GROUPS.songs]: [],
        };
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
    deck.push(DWARF);
    deck.push(MIMIC);
    deck.push(MIMIC);
    deck.push(LEPRECHAUN);
    deck.push(LEPRECHAUN);
    return deck;
    //return random.Shuffle(deck);
}