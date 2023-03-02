import { CARD_AUTUMN_SONG, CARD_GOBLIN_CREATURE, CARD_KOBOLD_CREATURE, CARD_SPRING_SONG, CARD_TROLL_CREATURE, CARD_WINTER_SONG, NONE } from './actions';

const Card = (name, value, image, imageExpanded, description, group = undefined, isSong = false, action = NONE) => ({
    name, value, image, imageExpanded, description, group, isSong, action
});

export const GROUPS = {
    dwarves: 'dwarves',
    elves: 'elves',
    fairies: 'fairies',
    fauns: 'fauns',
    leprechauns: 'leprechauns',
    wisps: 'wisps',
    gnomes: 'gnomes',
    goblins: 'goblins',
    kobolds: 'kobolds',
    trolls: 'trolls',
    songs: 'songs',
};

export const DWARF = Card("Anões", 2, "/images/dwarf.png", "/images/dwarf-expanded.png", "Na fase de compra pode escolher qualquer carta das pilhas de descarte (ao invés do topo)", GROUPS.dwarves);
export const ELF = Card("Elfos", 3, "/images/elf.png", "/images/elf-expanded.png", "Na fase de compra compre 3 cartas (ao invés de 2)", GROUPS.elves);
export const FAIRY = Card("Fadas", 1, "/images/fairy.png", "/images/fairy-expanded.png", "No final do jogo se ao menos 2 fadas estiveram no seu jardim, os mímicos valem zero (ao invés de -3)", GROUPS.fairies);
export const FAUN = Card("Faunos", 0, "/images/faun.png", "/images/faun-expanded.png", "No final do jogo se ao menos 2 faunos estiverem no seu jardim, ganhe 2 pontos para cada cada canção", GROUPS.fauns);
export const LEPRECHAUN = Card("Leprechauns", -4, "/images/leprechaun.png", "/images/leprechaun-expanded.png", "No final do jogo se ao menos 2 leprechauns estiverem no seu jardim, ele vale 4 pontos (ao invés de -4)", GROUPS.leprechauns);
export const WISP = Card("Fogos-fátuos", 2, "/images/wisp.png", "/images/wisp-expanded.png", "Se ao menos 2 fogos-fátuos estiverem no seu jardim, você só precisa ter 2 cartas da mesma raça para baixar (ao invés de 3)", GROUPS.wisps);
export const GNOME = Card("Gnomos", 3, "/images/gnome.png", "/images/gnome-expanded.png", "Ao executar uma busca, se ao menos 2 gnomos estiverem no seu jardim, você pode escolher qualquer carta para descartar.", GROUPS.gnomes);
export const GOBLIN = Card("Goblins", 3, "/images/goblin.png", "/images/goblin-expanded.png", "Quando o primeiro goblin entrar em seu jardim, escolha um jogador para comprar 2 cartas.", GROUPS.goblins, false, CARD_GOBLIN_CREATURE);
export const KOBOLD = Card("Kobolds", 2, "/images/kobold.png", "/images/kobold-expanded.png", "Quando o primeiro kobold entrar em seu jardim, você deve escolher uma carta de qualquer jardim e colocar no fundo do baralho.", GROUPS.kobolds, false, CARD_KOBOLD_CREATURE);
export const TROLL = Card("Trolls", 0, "/images/troll.png", "/images/troll-expanded.png", "Na primeira vez que um Troll entrar no seu jardim, escolha uma carta em jogo e coloque-a em qualquer jardim.", GROUPS.trolls, false, CARD_TROLL_CREATURE);
export const MIMIC = Card("Mímicos", -3, "/images/mimic.png", "/images/mimic-expanded.png",);

export const SPRING_SONG = Card("Canção da primavera", 0, "/images/spring.png", "/images/spring-expanded.png", "Escolha um jogador para fazer uma busca.", GROUPS.songs, true, CARD_SPRING_SONG);
export const SUMMER_SONG = Card("Canção do verão", -3, "/images/summer.png", "/images/summer-expanded.png", "Vale 8 pontos no final do jogo (em vez de -3).", GROUPS.songs, true, NONE);
// value of Autumn song card when its effect is enabled
export const SUMMER_SONG_ACTIVE_VALUE = 8;
export const AUTUMN_SONG = Card("Canção de outono", 0, "/images/autumn.png", "/images/autumn-expanded.png", "Escolha um jogador para comprar as 4 cartas do topo de uma das pilhas de descarte.", GROUPS.songs, true, CARD_AUTUMN_SONG);
export const WINTER_SONG = Card("Canção de inverno", 0, "/images/winter.png", "/images/winter-expanded.png", "Compre a carta do topo de uma pilha de descarte e em seguida faça uma busca.", GROUPS.songs, true, CARD_WINTER_SONG);

export const cards = [DWARF, ELF, FAIRY, FAUN, LEPRECHAUN, WISP, GNOME, GOBLIN, KOBOLD, TROLL, MIMIC, SPRING_SONG, SUMMER_SONG, AUTUMN_SONG, WINTER_SONG];