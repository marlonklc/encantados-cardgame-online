import React, { useEffect } from 'react';
import './Board.css';
import Modal from './components/Modal';
import Garden from './components/Garden';
import Hand from './components/Hand';
import Deck from './components/Deck';
import { playAudio } from './logic/audio';

export function Board({ ctx, G, moves, playerID, redo, sendChatMessage, matchData, isActive, isConnected, log, reset, events, ...ot }) {
    // console.log('redo>>>', redo)
    // console.log('sendChatMessage>>>', sendChatMessage)
    // console.log(log)
    // console.log('its the player active? ', isActive);
    // console.log('its the player connected?', isConnected);
    // console.log(ot)
    // console.log(matchData)
    // console.log(ctx.activePlayers[playerID])

    // console.log(isConnected)
    console.log(matchData)
    // console.log(ctx)

    const enemyPlayerID = matchData.filter(i => i.id !== parseInt(playerID))[0].id;

    useEffect(() => {
        const audio = playAudio('/audios/celestial-melody.mp3', .09);
        audio.loop = true;
    }, []);

    useEffect(() => {
        if (!!G.audio[playerID]) {
            const dynamicVolume = isActive ? 1 : .7;
            playAudio(G.audio[playerID].file, G.audio[playerID].volume * dynamicVolume);
            moves.resetAudio();
        }
    }, [G.audio[playerID]]); // eslint-disable-line

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

            <section class="enemy-area">
                {!matchData[enemyPlayerID].isConnected &&
                    <div class="enemy-offline-message">
                        <b>Oponente está offline...</b>
                    </div>
                }

                {!isActive &&
                    <div class="enemy-turn-message">
                        <b>Oponente está jogando...</b>
                    </div>
                }

                <Hand hand={G.hand[enemyPlayerID]} isEnemy={true} />

                <Garden garden={G.garden[enemyPlayerID]} />
            </section>

            <section class="deck-area">
                <Deck G={G} moves={moves} isActive={isActive} playerID={playerID} />
            </section>

            <section class="player-area">
                <Garden garden={G.garden[playerID]} />

                <Hand
                    hand={G.hand[playerID]}
                    G={G}
                    playerID={playerID}
                    enemyPlayerID={enemyPlayerID}
                    moves={moves}
                    isActive={isActive}
                />
            </section>

            {!!ctx.gameover &&
                (<Modal show={true} content={
                    <>
                        <h1 class="default-font-color">FIM DE JOGO !</h1>
                        <br />
                        <h4 class="player-font-color">Você fez {ctx.gameover.score[playerID]} pontos</h4>
                        <br />
                        <h4 class="enemy-font-color">Inimigo fez {ctx.gameover.score[enemyPlayerID]} pontos</h4>
                    </>
                } />)
            }

            <Modal G={G} show={G.showModal[playerID]} moves={moves} playerID={playerID} enemyPlayerID={enemyPlayerID} />
        </div>
    );
}