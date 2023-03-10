import React from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { Client } from 'boardgame.io/react';
import { Board } from './Board';
import { EncantadosGame } from './Game';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DEFAULT_PORT, APP_PRODUCTION } from './config';

const { origin, protocol, hostname } = window.location;
const SERVER_URL = APP_PRODUCTION ? origin : `${protocol}//${hostname}:${DEFAULT_PORT}`;

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
                <div>
                    <p>Jogar como {' '}
                        <button onClick={() => this.setState({ playerID: "0" })}>
                            Player 1
                        </button>
                        {' '}
                        <button onClick={() => this.setState({ playerID: "1" })}>
                            Player 2
                        </button>
                    </p>
                    <br />
                    <p><b>Como jogar ?</b></p>
                    <p>Escolher o player e enviar o link da barra de endereço pro seu amiguinho <BsEmojiSmile /></p>
                    <br />
                    <h3>Links</h3>
                    <a href="https://ludopedia.com.br/jogo/encantados-3-edicao" target="_blank" rel="noopener noreferrer">mais detalhes sobre o jogo</a>
                    <br /><br />
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