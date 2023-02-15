import { INVALID_MOVE } from 'boardgame.io/core';
import React, { useState } from 'react';
import './Board.css';
import Modal from './components/Modal';
import { DISCARD_CARD, DOWN_CARDS, TAKE_CARDS } from './logic/actions';

export function Board({ ctx, G, moves, playerID, redo, sendChatMessage, matchData, isActive, isConnected, log, ...ot }) {
    // console.log('redo>>>', redo)
    // console.log('sendChatMessage>>>', sendChatMessage)
    // console.log(log)
    // console.log('its the player active? ', isActive);
    // console.log('its the player connected?', isConnected);
    // console.log(ot)
    // console.log(matchData)

    const enemyPlayerID = matchData.filter(i => i.id !== parseInt(playerID))[0].id;
    const [selectedCards, setSelectedCards] = useState([]);
    const takeCardsFromSearch = () => moves.takeCardsFromSearch();
    const takeCardFromSearchDiscard = () => moves.takeCardFromDiscard('search');
    const takeCardFromEndTurnDiscard = () => moves.takeCardFromDiscard('endTurn');
    const discardToSearch = (card) => moves.discardToSearch(card.index);
    const downCreatureCards = (cards) => {
        if (moves.downCreatureCards(cards) !== INVALID_MOVE) {
            clearSelectedCards();
        }
    };
    const downSongCard = (card) => moves.downSongCard(card);
    const discardToEndTurn = (card) => moves.discardToEndTurn(card.index);

    let winner = '';

    if (ctx.gameover) {
        winner = ctx.gameover.winner !== undefined ?
            (<div id="winner">Winner: {ctx.gameover.winner}</div>)
            :
            (<div id="winner">Draw!</div>)
            ;
    }

    async function selectCard(card, event, index) {
        event.preventDefault();
        card.index = index;

        if (event.target.classList.contains('selected-card')) {
            const filtered = selectedCards.filter(i => i.index !== card.index);
            setSelectedCards(filtered);
        } else {
            if (G.currentAction === DISCARD_CARD && selectedCards.length > 0) return;
            setSelectedCards([...selectedCards, card]);
        }

        event.target.classList.toggle('selected-card');
    }

    async function clearSelectedCards() {
        setSelectedCards([]);
        Array.from(document.querySelectorAll('.selected-card')).forEach(element => element.classList.remove('selected-card'));
    }

    return (
        <>
            <h4>current player: {playerID} ({isActive}{isConnected}) - msg: {G.alert}</h4>

            <h4>INIMIGO</h4>
            <section style={{ backgroundColor: '#a81944', display: 'flex', width: '100vw', height: '15vh' }}>
                {G.hand[enemyPlayerID].map((card, index) => (
                    <div key={index} class="card-enemy">ENCANTADOS</div>
                ))}
                <div style={{ width: '100vw', height: '15vh', display: 'flex' }}>
                    <ul class="garden">
                        {G.garden[enemyPlayerID].trolls.map((card, index) => (
                            <li key={index} class="garden-card">{card.name}</li>
                        ))}
                    </ul>
                    <ul class="garden">
                        {G.garden[enemyPlayerID].songs.map((card, index) => (
                            <li key={index} class="garden-card">{card.name}</li>
                        ))}
                    </ul>
                </div>
            </section>

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
            <section style={{ backgroundColor: '#ccc', display: 'flex', width: '100vw', height: '15vh' }}>
                <ul class="garden">
                    {G.garden[playerID].trolls.map((card, index) => (
                        <li key={index} class="garden-card">{card.name}</li>
                    ))}
                </ul>
                <ul class="garden">
                    {G.garden[playerID].dwarves.map((card, index) => (
                        <li key={index} class="garden-card">{card.name}</li>
                    ))}
                </ul>
                <ul class="garden">
                    {G.garden[playerID].songs.map((card, index) => (
                        <li key={index} class="garden-card">{card.name}</li>
                    ))}
                </ul>
            </section>

            <h3>TUA MAO</h3>
            <section style={{ backgroundColor: '#0a72a8', display: 'flex', width: '100vw', height: '15vh' }} disabled={!isActive}>
                {G.hand[playerID].map((card, index) => (
                    <div key={index} class="card" onClick={isActive ? e => selectCard(card, e, index) : undefined}>{card.name}</div>
                ))}

                {isActive && <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        disabled={selectedCards.length !== 1}
                        hidden={G.currentAction !== DISCARD_CARD}
                        onClick={() => {
                            discardToSearch(selectedCards[0]);
                            clearSelectedCards();
                        }}
                    >descarta compra</button>
                    <button
                        disabled={selectedCards.length !== 3}
                        hidden={G.currentAction !== DOWN_CARDS || selectedCards.some(c => c.isSong) || !!G.playerAlreadyDownedCreatureCard}
                        onClick={() => downCreatureCards(selectedCards)}
                    >baixar raça</button>
                    <button
                        disabled={selectedCards.length !== 1}
                        hidden={G.currentAction !== DOWN_CARDS || selectedCards.some(c => !c.isSong) || !!G.playerAlreadyDownedSongCard}
                        onClick={() => {
                            downSongCard(selectedCards[0]);
                            clearSelectedCards();
                        }}
                    >baixar canção</button>
                    <button
                        disabled={selectedCards.length !== 1}
                        hidden={G.currentAction !== DOWN_CARDS}
                        onClick={() => {
                            discardToEndTurn(selectedCards[0]);
                            clearSelectedCards();
                        }}
                    >descarte final turno</button>
                </div>}
            </section>
            {winner}

            <Modal G={G} moves={moves} playerID={playerID} enemyPlayerID={enemyPlayerID} />

            {/* <Modal show={G.showModal[playerID]}>
                {modalContent}
            </Modal> */}
        </>
    );
}