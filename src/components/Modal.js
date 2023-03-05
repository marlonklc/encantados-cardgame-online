import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
    CARD_AUTUMN_SONG, CARD_AUTUMN_SONG_EXECUTE, CARD_GOBLIN_CREATURE, CARD_KOBOLD_CREATURE, CARD_SPRING_SONG, CARD_TROLL_CREATURE, CARD_WINTER_SONG, DISCARD_CARD,
    SELECT_CARD_FROM_END_TURN_DISCARD, SELECT_CARD_FROM_SEARCH_DISCARD
} from '../logic/actions';
import { AUTUMN_SONG, DWARF, GOBLIN, GROUPS, KOBOLD, SPRING_SONG, TROLL, WINTER_SONG } from '../logic/cards';
import Button from './Button';
import CardList from './CardList';
import Garden from './Garden';
import Hand from './Hand';
import './Modal.css';

const Modal = ({ G = {}, show, moves = {}, playerID, enemyPlayerID, isCloseable = false, content = '', onClose, zIndex = 10001 }) => {

    const [selectedCards, setSelectedCards] = useState([]);
    const [cardToMove, setCardToMove] = useState();

    useEffect(() => {
        setSelectedCards([]);
        setCardToMove();
    }, [show]);

    const closeOnEscapeKeyDown = e => {
        if ((e.charCode || e.keyCode) === 27) {
            onClose();
        }
    };

    useEffect(() => {
        if (isCloseable) {
            document.body.addEventListener("keydown", closeOnEscapeKeyDown);
            return function cleanup() {
                document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
            };
        }
    }, []); // eslint-disable-line

    const hasElvesOnGarden = G.garden ? G.garden[playerID][GROUPS.elves].filter(card => card.group === GROUPS.elves).length >= 2 : false;

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
        <div className={`modal ${show ? 'enter-done' : ''}`} onClick={isCloseable ? () => onClose() : undefined} style={{ zIndex }}>
            <div class="modal-content">
                {content}
                {G.currentAction === DISCARD_CARD && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação Busca]</b> Selecione {hasElvesOnGarden ? 'duas cartas' : 'uma carta'} para o DESCARTE...</h4>
                    </div>
                    <div class="modal-body">
                        <CardList cards={G.tempDeck} maxSelected={1} onSelectCard={(cards) => setSelectedCards(cards)}>
                            <Button
                                text="descartar"
                                disable={shouldDisableDiscardButton()}
                                onClick={() => {
                                    moves.discardToSearch(selectedCards);
                                    clearSelectedCards();
                                }}
                            />
                        </CardList>
                    </div>
                </>}

                {G.currentAction === CARD_SPRING_SONG && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {SPRING_SONG.name}]</b> Selecione o jogador que fará a compra.</h4>
                    </div>
                    <div class="modal-body">
                        <Button
                            text="Você"
                            onClick={() => moves.springSongCardExecute(playerID)}
                            customClass="player-font-color player-button-custom"
                        />
                        <Button
                            text="Inimigo"
                            onClick={() => moves.springSongCardExecute(enemyPlayerID)}
                            customClass="enemy-font-color enemy-button-custom"
                        />
                    </div>
                </>}

                {G.currentAction === CARD_AUTUMN_SONG && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {AUTUMN_SONG.name}]</b> Selecione o jogador que comprará as 4 cartas do topo de qualquer pilha de descarte.</h4>
                    </div>
                    <div class="modal-body">
                        <Button
                            text="Você"
                            onClick={() => moves.autumnSongCardSelectPlayer(playerID)}
                            customClass="player-font-color player-button-custom"
                        />
                        <Button
                            text="Inimigo"
                            onClick={() => moves.autumnSongCardSelectPlayer(enemyPlayerID)}
                            customClass="enemy-font-color enemy-button-custom"
                        />
                    </div>
                </>}

                {G.currentAction === CARD_AUTUMN_SONG_EXECUTE && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {AUTUMN_SONG.name}]</b> Selecione qual pilha de descarte você quer pegar.</h4>
                    </div>
                    <div class="modal-body">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                text="pegar descarte de compra"
                                onClick={() => moves.autumnSongCardExecute('search')}
                            />

                            <Hand hand={G.deckDiscardSearch.slice(-4)} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '7vh' }}>
                            <Button
                                text="pegar descarte de fim de turno"
                                onClick={() => moves.autumnSongCardExecute('endTurn')}
                            />

                            <Hand hand={G.deckDiscardEndTurn.slice(-4)} />
                        </div>
                    </div>
                </>}

                {G.currentAction === CARD_GOBLIN_CREATURE && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {GOBLIN.name}]</b> Selecione o jogador que irá comprar 2 cartas...</h4>
                    </div>
                    <div class="modal-body">
                        <Button
                            text="Você"
                            onClick={() => moves.goblinCardExecute(playerID)}
                            customClass="player-font-color player-button-custom"
                        />
                        <Button
                            text="Inimigo"
                            onClick={() => moves.goblinCardExecute(enemyPlayerID)}
                            customClass="enemy-font-color enemy-button-custom"
                        />
                    </div>
                </>}

                {G.currentAction === CARD_KOBOLD_CREATURE && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {KOBOLD.name}]</b> Selecione a carta que quer colocar no fundo do baralho...</h4>
                    </div>
                    <div class="modal-body">
                        <h4 class="enemy-font-color">INIMIGO</h4>
                        <Garden
                            garden={G.garden[enemyPlayerID]}
                            playerID={enemyPlayerID}
                            onSelectCard={(selected) => selectCardToMove(selected, playerID)}
                            selectedCard={cardToMove}
                            showSelectedGarden={false}
                        />
                        <h4 class="player-font-color">TEU JARDIM</h4>
                        <Garden
                            garden={G.garden[playerID]}
                            playerID={playerID}
                            onSelectCard={(selected) => selectCardToMove(selected, enemyPlayerID)}
                            selectedCard={cardToMove}
                            showSelectedGarden={false}
                        />
                    </div>
                    <div class="modal-action">
                        <Button
                            disable={!cardToMove}
                            text="mover"
                            onClick={() => moves.koboldCardExecute(cardToMove.playerID, cardToMove.group, cardToMove.index)}
                        />
                        <Button
                            text="pular"
                            onClick={() => moves.skipKoboldCardExecute()}
                        />
                    </div>
                </>}

                {G.currentAction === CARD_TROLL_CREATURE && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {TROLL.name}]</b> Selecione a carta que deseja mover...</h4>
                    </div>
                    <div class="modal-body">
                        <h4 class="enemy-font-color">INIMIGO</h4>
                        <Garden
                            garden={G.garden[enemyPlayerID]}
                            playerID={enemyPlayerID}
                            onSelectCard={(selected) => selectCardToMove(selected, playerID)}
                            selectedCard={cardToMove}
                        />
                        <h4 class="player-font-color">TEU JARDIM</h4>
                        <Garden
                            garden={G.garden[playerID]}
                            playerID={playerID}
                            onSelectCard={(selected) => selectCardToMove(selected, enemyPlayerID)}
                            selectedCard={cardToMove}
                        />
                    </div>
                    <div class="modal-action">
                        <Button
                            disable={!cardToMove}
                            text="mover"
                            onClick={() => moves.trollCardExecute(cardToMove.playerID, cardToMove.group, cardToMove.index, cardToMove.toPlayer)}
                        />
                        <Button
                            text="pular"
                            onClick={() => moves.skipTrollCardExecute()}
                        />
                    </div>
                </>}

                {G.currentAction === CARD_WINTER_SONG && <>
                    <div class="modal-header">
                        <h4 class="modal-title">
                            <b>[Ação {WINTER_SONG.name}]</b> Selecione a carta de uma pilha de descarte.
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                text="pegar descarte de compra"
                                onClick={() => moves.winterSongCardExecute('search')}
                            />

                            <Hand hand={G.deckDiscardSearch.slice(-1)} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '7vh' }}>
                            <Button
                                text="pegar descarte de fim de turno"
                                onClick={() => moves.winterSongCardExecute('endTurn')}
                            />

                            <Hand hand={G.deckDiscardEndTurn.slice(-1)} />
                        </div>
                    </div>
                </>}

                {G.currentAction === SELECT_CARD_FROM_SEARCH_DISCARD && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {DWARF.name}]</b> Escolha uma carta do descarte de compras...</h4>
                    </div>
                    <div class="modal-body">
                        <CardList cards={G.deckDiscardSearch} maxSelected={1} onSelectCard={(cards) => setSelectedCards(cards)}>
                            <Button
                                text="pegar"
                                disable={selectedCards.length !== 1}
                                onClick={() => {
                                    moves.selectCardFromDiscard('search', selectedCards[0].index);
                                    clearSelectedCards();
                                }}
                            />
                        </CardList>
                    </div>
                </>}

                {G.currentAction === SELECT_CARD_FROM_END_TURN_DISCARD && <>
                    <div class="modal-header">
                        <h4 class="modal-title"><b>[Ação {DWARF.name}]</b> Escolha uma carta do descarte de fim de turno...</h4>
                    </div>
                    <div class="modal-body">
                        <CardList cards={G.deckDiscardEndTurn} maxSelected={1} onSelectCard={(cards) => setSelectedCards(cards)}>
                            <Button
                                text="pegar"
                                disable={selectedCards.length !== 1}
                                onClick={() => {
                                    moves.selectCardFromDiscard('endTurn', selectedCards[0].index);
                                    clearSelectedCards();
                                }}
                            />
                        </CardList>
                    </div>
                </>}
            </div>
        </div>,
        document.getElementById("root")
    );
};

export default Modal;
