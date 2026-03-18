const { Server, Origins } = require('boardgame.io/server');
const { EncantadosGame } = require('./Game');
const { DEFAULT_PORT } = require('./config');

const PORT = process.env.PORT_ENCANTADOSONLINE_SRC_SERVER || DEFAULT_PORT;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'http://localhost:8000';

const server = Server({
    games: [EncantadosGame],
    origins: [
        'https://encantados.marlonklc.com', 
        Origins.LOCALHOST
    ]
});

server.run({ port: PORT });
