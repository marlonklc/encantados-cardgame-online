import { INVALID_MOVE } from 'boardgame.io/core';
import React, { useState } from 'react';
import './Board.css';
import Modal from './components/Modal';
import { DISCARD_CARD, DOWN_CARDS, TAKE_CARDS } from './logic/actions';
import { GROUPS } from './logic/cards';
import _ from 'lodash';
import Garden from './components/Garden';
import Hand from './components/Hand';

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
    const [selectedCards, setSelectedCards] = useState([]);
    const takeCardsFromSearch = () => moves.takeCardsFromSearch();
    const takeCardFromSearchDiscard = () => moves.takeCardFromDiscard('search');
    const takeCardFromEndTurnDiscard = () => moves.takeCardFromDiscard('endTurn');
    // const discardToSearch = (card) => moves.discardToSearch(card.index);
    // const downSongCard = (card) => moves.downSongCard(card);

    let winner = '';

    if (ctx.gameover) {
        winner = ctx.gameover.winner !== undefined ?
            (<div id="winner">Winner: {ctx.gameover.winner}</div>)
            :
            (<div id="winner">Draw!</div>)
            ;
    }

    // function clearSelectedCards() {
    //     setSelectedCards([]);
    //     Array.from(document.querySelectorAll('.selected-card')).forEach(element => element.classList.remove('selected-card'));
    // }

    // function shouldDisableDownCreatures() {
    //     const hasWispsOnGarden = G.garden[playerID][GROUPS.wisps].filter(card => card.group === GROUPS.wisps).length >= 2;

    //     const grouped = _.groupBy(selectedCards, c => c.group);

    //     if (Object.keys(grouped).length > 2) return true;

    //     const mimics = Object.keys(grouped).filter(k => k === 'undefined').flatMap(k => grouped[k]);
    //     const leprechauns = Object.keys(grouped).filter(k => k === GROUPS.leprechauns).flatMap(k => grouped[k]);

    //     if (!!leprechauns.length && !!mimics.length) return true;
    //     if (mimics.length > 1) return true;

    //     return hasWispsOnGarden ? selectedCards.length < 2 : selectedCards.length < 3;
    // }

    return (
        <>
            <img src="/images/teste.png" class="image-background" alt=""/>

            <h4>current player: {playerID} ({isActive}{isConnected}) - msg: {G.alert}</h4>

            <h4>INIMIGO</h4>
            <Garden garden={G.garden[enemyPlayerID]} bgColor="#a81944"/>

            <section style={{ display: 'flex' }} disabled={isActive}>
                <div class="deck">
                    <p>descarte busca ({G.deckDiscardSearch.length})</p>
                    {!!G.deckDiscardSearch.length && <p style={{ width: '80%', height: '50%', border: '1px solid #ccc', textAlign: 'center' }}>{G.deckDiscardSearch.slice(-1)[0].name}</p>}
                    <button
                        hidden={G.deckDiscardSearch.length <= 0 || G.currentAction !== TAKE_CARDS || !isActive}
                        onClick={() => takeCardFromSearchDiscard()}>pegar</button>
                </div>
                <div class="deck">
                    <p>busca</p>
                    <p>{G.deck.length}</p>
                    <button hidden={G.currentAction !== TAKE_CARDS || !isActive} onClick={() => takeCardsFromSearch(playerID)}>comprar</button>
                </div>
                <div class="deck">
                    <p>descarte fim turno ({G.deckDiscardEndTurn.length})</p>
                    {!!G.deckDiscardEndTurn.length && <p style={{ width: '80%', height: '50%', border: '1px solid #ccc', textAlign: 'center' }}>{G.deckDiscardEndTurn.slice(-1)[0].name}</p>}
                    <button
                        hidden={G.deckDiscardEndTurn.length <= 0 || G.currentAction !== TAKE_CARDS || !isActive}
                        onClick={() => takeCardFromEndTurnDiscard()}>pegar</button>
                </div>
            </section>

            <h4>TEU JARDIM</h4>
            <Garden garden={G.garden[playerID]} bgColor="#0a72a8"/>

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
            {winner}

            <Modal G={G} show={G.showModal[playerID]} moves={moves} playerID={playerID} enemyPlayerID={enemyPlayerID} />
        </>
    );
}