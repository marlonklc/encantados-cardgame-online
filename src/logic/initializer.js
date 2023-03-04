import { AUTUMN_SONG, DWARF, ELF, FAIRY, FAUN, GNOME, GOBLIN, GROUPS, KOBOLD, LEPRECHAUN, MIMIC, 
    SPRING_SONG, SUMMER_SONG, TROLL, WINTER_SONG, WISP } from './cards';

export function initializeGarden(numberPlayers) {
    const gardens = Array(numberPlayers);
    for (let i = 0; i + 1 <= numberPlayers; i++) {
        gardens[i] = {
            [GROUPS.dwarves]: [],
            [GROUPS.elves]: [],
            [GROUPS.fairies]: [],
            [GROUPS.fauns]: [FAUN, FAUN],
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

export function initializePlayersHand(ctx, deck) {
    const hand1 = [];
    const hand2 = [];

    Array(10).fill('').forEach(i => {
        hand1.push(deck.pop());
        hand2.push(deck.pop());
    });

    return { 0: hand1, 1: hand2 };
}

export function initializeDeck({ random }) {
    const deck = []
    Array(5).fill('').forEach(i => deck.push(DWARF));
    Array(5).fill('').forEach(i => deck.push(ELF));
    Array(5).fill('').forEach(i => deck.push(FAIRY));
    Array(5).fill('').forEach(i => deck.push(FAUN));
    Array(5).fill('').forEach(i => deck.push(LEPRECHAUN));
    Array(5).fill('').forEach(i => deck.push(WISP));
    Array(5).fill('').forEach(i => deck.push(GNOME));
    Array(5).fill('').forEach(i => deck.push(MIMIC));
    Array(4).fill('').forEach(i => deck.push(GOBLIN));
    Array(4).fill('').forEach(i => deck.push(KOBOLD));
    Array(4).fill('').forEach(i => deck.push(TROLL));
    Array(3).fill('').forEach(i => deck.push(SPRING_SONG));
    Array(2).fill('').forEach(i => deck.push(AUTUMN_SONG));
    Array(2).fill('').forEach(i => deck.push(WINTER_SONG));
    Array(1).fill('').forEach(i => deck.push(SUMMER_SONG));
    return random.Shuffle(deck);
}