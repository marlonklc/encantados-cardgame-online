import React from 'react';
import { Client } from 'boardgame.io/react';
import { Board } from './Board';
import { Game } from './Game';
import { SocketIO } from 'boardgame.io/multiplayer';

const GameClient = Client({
    game: Game,
    board: Board,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    numPlayers: 2
});

export default class App extends React.Component {
    state = { playerID: null };

    render() {
        if (this.state.playerID === null) {
            return (
                <div>
                    <p>Play as</p>
                    <button onClick={() => this.setState({ playerID: "0" })}>
                        Player 0
                    </button>
                    <button onClick={() => this.setState({ playerID: "1" })}>
                        Player 1
                    </button>
                </div>
            );
        }
        return (
            <div>
                <GameClient playerID={this.state.playerID}
                 matchID="match-example"
                />
            </div>
        );
    }
}