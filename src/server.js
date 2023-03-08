const { Server, Origins } = require('boardgame.io/server');
const { EncantadosGame } = require('./Game');
const { DEFAULT_PORT } = require('./config');
const path = require('path');
const serve = require('koa-static');

const PORT = process.env.PORT_SRC_SERVER || process.env.PORT_ENCANTADOSONLINE_SRC_SERVER || DEFAULT_PORT;

const server = Server({
    games: [EncantadosGame],
    origins: ['http://www.marlonklc.kinghost.net', Origins.LOCALHOST]
});

const frontEndAppBuildPath = path.resolve(__dirname, "../build");
server.app.use(serve(frontEndAppBuildPath));

server.run({
    port: PORT,
    callback: () => {
        async (ctx, next) => await serve(frontEndAppBuildPath)(
            Object.assign(ctx, { path: 'index.html' }),
            next
        )
    },
    // lobbyConfig: {
    //   uuid: customAlphabet("ABCDEFGHJKMNOPQRSTUVWXYZ0123456789", 6),
    // },
});
