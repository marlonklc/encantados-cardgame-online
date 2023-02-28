import { AUTUMN_SONG, cards, DWARF, ELF, FAIRY, FAUN, GNOME, GOBLIN, GROUPS, KOBOLD, LEPRECHAUN, MIMIC, SPRING_SONG, SUMMER_SONG, TROLL, WINTER_SONG, WISP } from './cards';

export function initializeGarden(numberPlayers) {
    const gardens = Array(numberPlayers);
    for (let i = 0; i + 1 <= numberPlayers; i++) {
        gardens[i] = {
            [GROUPS.dwarves]: [],
            [GROUPS.elves]: [],
            [GROUPS.fairies]: [],
            [GROUPS.fauns]: [],
            [GROUPS.wisps]: [],
            [GROUPS.gnomes]: [],
            [GROUPS.goblins]: [],
            [GROUPS.kobolds]: [],
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
    // deck.push(TROLL);
    // deck.push(TROLL);
    // deck.push(MIMIC);
    // deck.push(SPRING_SONG);
    
    // deck.push(WINTER_SONG);
    // deck.push(DWARF);
    // deck.push(DWARF);
    // deck.push(DWARF);
    // deck.push(DWARF);
    // deck.push(GNOME);
    // deck.push(MIMIC);
    deck.push(GNOME);
    deck.push(SPRING_SONG);
    deck.push(AUTUMN_SONG);
    return deck;
    //return random.Shuffle(deck);
}