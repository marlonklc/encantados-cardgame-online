import React from 'react';
import { Client } from 'boardgame.io/react';
import { Board } from './Board';
import { EncantadosGame } from './Game';
import { SocketIO } from 'boardgame.io/multiplayer';

const EncantadosGameClient = Client({
    game: EncantadosGame,
    board: Board,
    // debug: false,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    numPlayers: 2
});

export default class App extends React.Component {
    state = { playerID: null, matchID: null };

    componentDidMount() {
        const matchID = localStorage.getItem('matchID') || new Date().toISOString();

        localStorage.setItem('matchID', matchID);

        this.setState({ matchID })
    }

    resetGame = () => {
        const newMatchID = new Date().toISOString();

        localStorage.setItem('matchID', newMatchID);
        this.setState({ matchID: newMatchID });

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