import React, { useEffect } from 'react';
import './Board.css';
import Modal from './components/Modal';
import Garden from './components/Garden';
import Hand from './components/Hand';
import Deck from './components/Deck';
import { playAudio } from './logic/audio';
import Button from './components/Button';

export function Board({ ctx, G, moves, playerID, redo, sendChatMessage, matchData, isActive, isConnected, log, reset, events, ...ot }) {
    const enemyPlayerID = matchData.filter(i => i.id !== parseInt(playerID))[0].id;

    useEffect(() => {
        const audio = playAudio('/audios/relaxation-music1.mp3', .05);
        audio.loop = true;
    }, []);

    useEffect(() => {
        if (!!G.audio[playerID]) {
            const dynamicVolume = isActive ? 1 : 0.5;
            playAudio(G.audio[playerID].file, G.audio[playerID].volume * dynamicVolume);
            moves.resetAudio();
        }
    }, [G.audio[playerID]]); // eslint-disable-line

    function playAgain() {
        // window.location.search = `matchID=match-${new Date().getTime()}&playerID=${playerID}`;
        window.location.search = `matchID=match-${new Date().getTime()}`;
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

            <section class="enemy-area">
                {!matchData[enemyPlayerID].isConnected &&
                    <div class="enemy-offline-message">
                        <b>Oponente está offline...</b>
                    </div>
                }

                {!isActive && matchData[enemyPlayerID].isConnected &&
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
                (<Modal show={true} zIndex={9999} content={
                    <>
                        <h1 class="default-font-color">FIM DE JOGO !</h1>
                        <br />
                        <h4 class="player-font-color">Você fez {ctx.gameover.score[playerID]} pontos</h4>
                        {!!G.hand[playerID].length && <Hand hand={G.hand[playerID]} enableActions={false} />}
                        <br />
                        <h4 class="enemy-font-color">Oponente fez {ctx.gameover.score[enemyPlayerID]} pontos</h4>
                        {!!G.hand[enemyPlayerID].length && <Hand hand={G.hand[enemyPlayerID]} enableActions={false} />}
                        <br />
                        <Button text="Jogar novamente" onClick={() => playAgain()} />
                    </>
                } />)
            }

            <Modal G={G} show={G.showModal[playerID]} moves={moves} playerID={playerID} enemyPlayerID={enemyPlayerID} />
        </div>
    );
}