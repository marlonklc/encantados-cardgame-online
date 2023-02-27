const { Server, Origins } = require('boardgame.io/server');
const { EncantadosGame } = require('./Game');

const server = Server({
    games: [EncantadosGame],
    origins: [Origins.LOCALHOST]
});

server.run(8000);