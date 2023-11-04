import React from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { Client } from 'boardgame.io/react';
import { Board } from './Board';
import { EncantadosGame } from './Game';
import { SocketIO } from 'boardgame.io/multiplayer';
import { APP_PRODUCTION, PORT_PRODUCTION, DEFAULT_PORT } from './config';

const SERVER_URL = APP_PRODUCTION ? `http://www.marlonklc.kinghost.net:${PORT_PRODUCTION}` : `http://localhost:${DEFAULT_PORT}`;

const EncantadosGameClient = Client({
    game: EncantadosGame,
    board: Board,
    debug: false,
    multiplayer: SocketIO({ server: SERVER_URL }),
    numPlayers: 2
});

export default class App extends React.Component {
    state = { playerID: null, matchID: null };

    componentDidMount() {
        const matchID = new URLSearchParams(window.location.search).get('matchID');
        const playerID = new URLSearchParams(window.location.search).get('playerID');

        if (matchID === null) {
            window.location.search = `matchID=match-${new Date().getTime()}`
        }

        this.setState({ matchID, playerID })
    }

    render() {
        if (this.state.playerID === null) {
            return (
                <div id="initial-screen">
                    <section class="initial-screen-players">
                        <span>jogar como:</span>
                        <button 
                            onClick={() => this.setState({ playerID: "0" })}
                            disabled={false}
                        >
                            Player 1
                        </button>
                        <button 
                            onClick={() => this.setState({ playerID: "1" })}
                            disabled={false}
                        >
                            Player 2
                        </button>
                    </section>
                    <br />
                    <p><b>Como jogar ?</b></p>
                    <p>1. Escolha com qual player quer jogar.</p> 
                    <p>2. Envie o link pro seu amigo e peça para ele escolher o outro jogador <BsEmojiSmile /></p>
                    <br />
                    <h3>Links</h3>
                    <a href="https://ludopedia.com.br/jogo/encantados-3-edicao" target="_blank" rel="noopener noreferrer">mais detalhes sobre o jogo</a>
                    <a href="https://ludopedia.com.br/download.php?id_jogo_anexo=179044" target="_blank" rel="noopener noreferrer">manual do jogo</a>
                </div>
            );
        }
        return (
            <div>
                <EncantadosGameClient playerID={this.state.playerID}
                    matchID={this.state.matchID}
                />
            </div>
        );
    }
}