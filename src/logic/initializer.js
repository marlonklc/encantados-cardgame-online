import { AUTUMN_SONG, cards, DWARF, ELF, FAIRY, FAUN, GNOME, GOBLIN, GROUPS, LEPRECHAUN, MIMIC, SPRING_SONG, TROLL, WINTER_SONG, WISP } from './cards';

export function initializeGarden(numberPlayers) {
    const gardens = Array(numberPlayers);
    for (let i = 0; i + 1 <= numberPlayers; i++) {
        gardens[i] = {
            [GROUPS.dwarves]: [DWARF, DWARF, DWARF],
            [GROUPS.elves]: [ELF, ELF, ELF],
            [GROUPS.fairies]: [ELF, ELF, ELF],
            [GROUPS.fauns]: [ELF, ELF, ELF],
            [GROUPS.wisps]: [ELF, ELF, ELF],
            [GROUPS.gnomes]: i !== 0 ? [GNOME,GNOME,GNOME, MIMIC] : [],
            [GROUPS.goblins]: i !== 0 ? [GOBLIN,GOBLIN,MIMIC] : [],
            [GROUPS.kobolds]: [ELF, ELF, ELF],
            [GROUPS.leprechauns]: [],
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
    deck.push(GNOME);
    deck.push(MIMIC);
    deck.push(GNOME);
    deck.push(GNOME);
    return deck;
    //return random.Shuffle(deck);
}