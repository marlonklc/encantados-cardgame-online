const { Server, Origins } = require('boardgame.io/server');
const { Game } = require('./Game');

const server = Server({
    games: [Game],
    origins: [Origins.LOCALHOST]
});

server.run(8000);