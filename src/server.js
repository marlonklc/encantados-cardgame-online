const { Server, Origins } = require('boardgame.io/server');
const { EncantadosGame } = require('./Game');
const { DEFAULT_SERVER_PORT } = require('./config');

const PORT = Number(process.env.SERVER_PORT) || DEFAULT_SERVER_PORT;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'http://localhost:8000';

const server = Server({
    games: [EncantadosGame],
    origins: [
        ALLOW_ORIGIN,
        Origins.LOCALHOST
    ]
});

server.run({ port: PORT });
