import { CARD_AUTUMN_SONG, CARD_SPRING_SONG, CARD_WINTER_SONG, NONE } from './actions';

const Card = (name, value, image, description, group = undefined, isSong = false, action = NONE) => ({
    name, value, image, description, group, isSong, action
});

export const GROUPS = {
    dwarves: 'dwarves',
    elves: 'elves',
    fairies: 'fairies',
    fauns: 'fauns',
    leprechauns: 'leprechauns',
    wisps: 'wisps',
    gnomes: 'gnomes',
    trolls: 'trolls',
    songs: 'songs',
};

export const DWARF = Card("Anões", 2, "/images/", "Na fase de compra pode escolher qualquer carta das pilhas de descarte (ao invés do topo)", GROUPS.dwarves);
export const ELF = Card("Elfos", 3, "/images/", "Na fase de compra compre 3 cartas (ao invés de 2)", GROUPS.elves);
export const FAIRY = Card("Fadas", 1, "/images/", "No final do jogo se ao menos 2 fadas estiveram no seu jardim, os mímicos valem zero (ao invés de -3)", GROUPS.fairies);
export const FAUN = Card("Faunos", 0, "/images/", "No final do jogo se ao menos 2 faunos estiverem no seu jardim, ganhe 2 pontos para cada cada canção", GROUPS.fauns);
export const LEPRECHAUN = Card("Leprechauns", -4, "/images/", "No final do jogo se ao menos 2 leprechauns estiverem no seu jardim, ele vale 4 pontos (ao invés de -4)", GROUPS.leprechauns);
export const WISP = Card("Fogos-fátuos", 2, "/images/", "Se ao menos 2 fogos-fátuos estiverem no seu jardim, você só precisa ter 2 cartas da mesma raça para baixar (ao invés de 3)", GROUPS.wisps);
export const GNOME = Card("Gnomos", 3, "/images/", "Ao executar uma busca, se ao menos 2 gnomos estiverem no seu jardim, você pode escolher qualquer carta para descartar.", GROUPS.gnomes);

export const TROLL = Card("Trolls", 0, "/images/duke.png", "Na primeira vez que um Troll entrar no seu jardim, escolha uma carta em jogo e coloque-a em qualquer jardim.", GROUPS.trolls);
export const MIMIC = Card("Mímicos", -3, "/images/assassin.png");

export const SPRING_SONG = Card("Canção da primavera", 0, "/images/spring-song-card.png", "Escolha um jogador para fazer uma busca.", GROUPS.songs, true, CARD_SPRING_SONG);
export const SUMMER_SONG = Card("Canção do verão", -3, "/images/summer-song-card.png", "Vale 8 pontos no final do jogo (em vez de -3).", GROUPS.songs, true, NONE);
export const AUTUMN_SONG = Card("Canção de outono", 0, "/images/autumn-song-card.png", "Escolha um jogador para comprar as 4 cartas do topo de uma das pilhas de descarte.", GROUPS.songs, true, CARD_AUTUMN_SONG);
export const WINTER_SONG = Card("Canção de inverno", 0, "/images/winter-song-card.png", "Compre a carta do topo de uma pilha de descarte e em seguida faça uma busca.", GROUPS.songs, true, CARD_WINTER_SONG);

export const cards = [DWARF, ELF, TROLL, MIMIC, SPRING_SONG, AUTUMN_SONG, WINTER_SONG];
