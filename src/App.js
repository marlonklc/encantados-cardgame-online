import React from 'react';
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

        if (matchID === null) {
            window.location.search = `matchID=match-${new Date().getTime()}`
        }

        this.setState({ matchID })
    }

    resetGame = () => {
        window.location.search = `matchID=match-${new Date().getTime()}`

        alert('Jogo foi resetado!');
    }

    render() {
        if (this.state.playerID === null) {
            return (
                <div>
                    <p>JOGAR COMO:</p>
                    <button onClick={() => this.setState({ playerID: "0" })}>
                        Player 0
                    </button>
                    {' '}
                    <button onClick={() => this.setState({ playerID: "1" })}>
                        Player 1
                    </button>
                    <br/>
                    <br/>
                    <button onClick={this.resetGame}>
                        RESETAR O JOGO
                    </button>
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