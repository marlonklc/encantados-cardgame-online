import React from 'react';
import './Board.css';
import Modal from './components/Modal';
import { TAKE_CARDS } from './logic/actions';
import Garden from './components/Garden';
import Hand from './components/Hand';
import Deck from './components/Deck';

export function Board({ ctx, G, moves, playerID, redo, sendChatMessage, matchData, isActive, isConnected, log, ...ot }) {
    // console.log('redo>>>', redo)
    // console.log('sendChatMessage>>>', sendChatMessage)
    // console.log(log)
    // console.log('its the player active? ', isActive);
    // console.log('its the player connected?', isConnected);
    // console.log(ot)
    // console.log(matchData)
    // console.log(ctx.activePlayers[playerID])

    const enemyPlayerID = matchData.filter(i => i.id !== parseInt(playerID))[0].id;

    let winner = '';

    if (ctx.gameover) {
        winner = ctx.gameover.winner !== undefined ?
            (<div id="winner">Winner: {ctx.gameover.winner}</div>)
            :
            (<div id="winner">Draw!</div>)
            ;
    }

    return (
        <div class="board">
            <ul class="bg-lights">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <img src="/images/florest-bg.jpg" class="image-background" alt="" />

            {/* <h4>current player: {playerID} ({isActive}{isConnected}) - msg: {G.alert}</h4> */}

            <section class="enemy-area">
                {/* <h4>INIMIGO</h4>
                <Garden garden={G.garden[enemyPlayerID]} bgColor="#a81944"/> */}
            </section>

            <section class="deck-area">
                <Deck G={G} moves={moves} isActive={isActive} playerID={playerID} />
            </section>

            <section class="player-area">
                {/* <h4>TEU JARDIM</h4>
                <Garden garden={G.garden[playerID]} bgColor="#0a72a8"/> */}
                <Hand
                    ctx={ctx}
                    hand={G.hand[playerID]}
                    G={G}
                    gardens={G.garden}
                    playerID={playerID}
                    enemyPlayerID={enemyPlayerID}
                    moves={moves}
                    isActive={isActive}
                />
            </section>

            {winner}

            <Modal G={G} show={G.showModal[playerID]} moves={moves} playerID={playerID} enemyPlayerID={enemyPlayerID} />
        </div>
    );
}