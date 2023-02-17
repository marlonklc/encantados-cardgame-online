import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
    CARD_AUTUMN_SONG, CARD_AUTUMN_SONG_EXECUTE, CARD_GOBLIN_CREATURE, CARD_KOBOLD_CREATURE, CARD_SPRING_SONG, CARD_TROLL_CREATURE, CARD_WINTER_SONG, DISCARD_CARD,
    SELECT_CARD_FROM_END_TURN_DISCARD, SELECT_CARD_FROM_SEARCH_DISCARD
} from '../logic/actions';
import { AUTUMN_SONG, GOBLIN, GROUPS, KOBOLD, SPRING_SONG, TROLL } from '../logic/cards';
import Garden from './Garden';
import './Modal.css';

const Modal = ({ G, moves, playerID, enemyPlayerID }) => {

    const [selectedCards, setSelectedCards] = useState([]);
    const [cardToMove, setCardToMove] = useState();

    const showModalPlayer = G.showModal[playerID];

    useEffect(() => {
        setSelectedCards([]);
        setCardToMove();
    }, [showModalPlayer])

    const hasElvesOnGarden = G.garden[playerID][GROUPS.elves].filter(card => card.group === GROUPS.elves).length >= 2;

    async function selectCard(card, event, index) {
        event.preventDefault();
        card.index = index;

        if (event.target.classList.contains('selected-card')) {
            const filtered = selectedCards.filter(i => i.index !== card.index);
            setSelectedCards(filtered);
        } else {
            if (hasElvesOnGarden && selectedCards.length === 2) return;
            if (!hasElvesOnGarden && selectedCards.length === 1) return;
            setSelectedCards([...selectedCards, card]);
        }

        event.target.classList.toggle('selected-card');
    }

    function selectCardToMove(selected, toPlayer) {
        if (!!selected) setCardToMove({ ...selected, toPlayer });
        else setCardToMove();
    }

    function clearSelectedCards() {
        setSelectedCards([])
        setCardToMove();
    }

    function shouldDisableDiscardButton() {
        return hasElvesOnGarden ? selectedCards.length !== 2 : selectedCards.length !== 1;
    }

    return ReactDOM.createPortal(
        <div className={`modal ${showModalPlayer ? 'enter-done' : ''}`}>
            <div class="modal-content">
                {G.currentAction === DISCARD_CARD && <>
                    <div class="modal-header">
                        <h4 class="modal-title">BUSCA - Selecione {hasElvesOnGarden ? 'duas cartas' : 'uma carta'} para o DESCARTE...</h4>
                    </div>
                    <div class="modal-body">
                        {G.tempDeck.map((card, index) => (
                            <div key={index} class="card" onClick={e => selectCard(card, e, index)}>{card.name}</div>
                        ))}

                        <button disabled={shouldDisableDiscardButton()} onClick={() => {
                            moves.discardToSearch(selectedCards);
                            clearSelectedCards();
                        }}>descartar</button>
                    </div>
                </>}

                {G.currentAction === CARD_SPRING_SONG && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{SPRING_SONG.name}: Selecione o jogador que fará a compra.</h4>
                    </div>
                    <div class="modal-body">
                        <button onClick={() => moves.springSongCardExecute(playerID)}>Você</button>
                        <button onClick={() => moves.springSongCardExecute(enemyPlayerID)}>Inimigo</button>
                    </div>
                </>}

                {G.currentAction === CARD_AUTUMN_SONG && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{AUTUMN_SONG.name}: Selecione o jogador que comprará as 4 cartas do topo de qualquer pilha de descarte.</h4>
                    </div>
                    <div class="modal-body">
                        <button onClick={() => moves.autumnSongCardSelectPlayer(playerID)}>Você</button>
                        <button onClick={() => moves.autumnSongCardSelectPlayer(enemyPlayerID)}>Inimigo</button>
                    </div>
                </>}

                {G.currentAction === CARD_AUTUMN_SONG_EXECUTE && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{AUTUMN_SONG.name}: Selecione qual pilha de descarte você quer pegar.</h4>
                    </div>
                    <div class="modal-body">
                        <div>
                            <button onClick={() => moves.autumnSongCardExecute('search')}>descarte de compra</button>
                            {G.deckDiscardSearch.slice(-4).map((card, index) => (
                                <div key={index} class="card">{card.name}</div>
                            ))}
                        </div>
                        <div>
                            <button onClick={() => moves.autumnSongCardExecute('endTurn')}>descarte de fim de turno</button>
                            {G.deckDiscardEndTurn.slice(-4).map((card, index) => (
                                <div key={index} class="card">{card.name}</div>
                            ))}
                        </div>
                    </div>
                </>}

                {G.currentAction === CARD_GOBLIN_CREATURE && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{GOBLIN.name}: Selecione o jogador que irá comprar 2 cartas...</h4>
                    </div>
                    <div class="modal-body">
                        <button onClick={() => moves.goblinCardExecute(playerID)}>Você</button>
                        <button onClick={() => moves.goblinCardExecute(enemyPlayerID)}>Inimigo</button>
                    </div>
                </>}

                {G.currentAction === CARD_KOBOLD_CREATURE && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{KOBOLD.name}: Selecione a carta que quer colocar no fundo do baralho...</h4>
                    </div>
                    <div class="modal-body">
                        <h4>INIMIGO</h4>
                        <Garden
                            garden={G.garden[enemyPlayerID]}
                            playerID={enemyPlayerID}
                            bgColor="#a81944"
                            onSelectCard={(selected) => selectCardToMove(selected, playerID)}
                            selectedCard={cardToMove}
                            showSelectedGarden={false}
                        />
                        <h4>TEU JARDIM</h4>
                        <Garden
                            garden={G.garden[playerID]}
                            playerID={playerID}
                            bgColor="#0a72a8"
                            onSelectCard={(selected) => selectCardToMove(selected, enemyPlayerID)}
                            selectedCard={cardToMove}
                            showSelectedGarden={false}
                        />
                        <button disabled={!cardToMove} onClick={() => moves.koboldCardExecute(cardToMove.playerID, cardToMove.group, cardToMove.index)}>mover</button>
                    </div>
                </>}

                {G.currentAction === CARD_TROLL_CREATURE && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{TROLL.name}: Selecione a carta que deseja mover para o outro jardim...</h4>
                    </div>
                    <div class="modal-body">
                        <h4>INIMIGO</h4>
                        <Garden
                            garden={G.garden[enemyPlayerID]}
                            playerID={enemyPlayerID}
                            bgColor="#a81944"
                            onSelectCard={(selected) => selectCardToMove(selected, playerID)}
                            selectedCard={cardToMove}
                        />
                        <h4>TEU JARDIM</h4>
                        <Garden
                            garden={G.garden[playerID]}
                            playerID={playerID}
                            bgColor="#0a72a8"
                            onSelectCard={(selected) => selectCardToMove(selected, enemyPlayerID)}
                            selectedCard={cardToMove}
                        />
                        <button disabled={!cardToMove} onClick={() => moves.trollCardExecute(cardToMove.playerID, cardToMove.group, cardToMove.index, cardToMove.toPlayer)}>mover</button>
                    </div>
                </>}

                {G.currentAction === CARD_WINTER_SONG && <>
                    <div class="modal-header">
                        <h4 class="modal-title">{playerID !== G.playerSourceAction ?
                            'Você foi selecionado pra executar a ação da Canção de inverno. Selecione a carta de uma pilha de descarte.'
                            :
                            'Selecione a carta de uma pilha de descarte.'
                        }</h4>
                    </div>
                    <div class="modal-body">
                        <div>
                            <button onClick={() => moves.winterSongCardExecute('search')}>descarte de compra</button>
                            {G.deckDiscardSearch.slice(-1).map((card, index) => (
                                <div key={index} class="card">{card.name}</div>
                            ))}
                        </div>
                        <div>
                            <button onClick={() => moves.winterSongCardExecute('endTurn')}>descarte de fim de turno</button>
                            {G.deckDiscardEndTurn.slice(-1).map((card, index) => (
                                <div key={index} class="card">{card.name}</div>
                            ))}
                        </div>
                    </div>
                </>}

                {G.currentAction === SELECT_CARD_FROM_SEARCH_DISCARD && <>
                    <div class="modal-header">
                        <h4 class="modal-title">Escolha a carta do descarte de compras...</h4>
                    </div>
                    <div class="modal-body">
                        {G.deckDiscardSearch.map((card, index) => (
                            <div key={index} class="card" onClick={() => moves.selectCardFromDiscard('search', index)}>{card.name}</div>
                        ))}
                    </div>
                </>}

                {G.currentAction === SELECT_CARD_FROM_END_TURN_DISCARD && <>
                    <div class="modal-header">
                        <h4 class="modal-title">Escolha a carta do descarte de fim de turno...</h4>
                    </div>
                    <div class="modal-body">
                        {G.deckDiscardEndTurn.map((card, index) => (
                            <div key={index} class="card" onClick={() => moves.selectCardFromDiscard('endTurn', index)}>{card.name}</div>
                        ))}
                    </div>
                </>}
            </div>
        </div>,
        document.getElementById("root")
    );
};

export default Modal;
