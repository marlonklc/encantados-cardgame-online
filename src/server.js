const { Server, Origins } = require('boardgame.io/server');
const { EncantadosGame } = require('./Game');
const { DEFAULT_PORT } = require('./config');

const PORT = process.env.PORT_ENCANTADOSONLINE_SRC_SERVER || DEFAULT_PORT;

const server = Server({
    games: [EncantadosGame],
    origins: ['http://www.marlonklc.kinghost.net', Origins.LOCALHOST]
});

server.run({ port: PORT });
