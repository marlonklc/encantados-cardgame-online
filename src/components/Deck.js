import { TAKE_CARDS } from '../logic/actions';
import './Deck.css';
import { GiCardPick } from 'react-icons/gi';
import Modal from './Modal';
import { useState } from 'react';

const Deck = ({ G, moves, playerID, isActive }) => {

    const [showDiscardCards, setShowDiscardCards] = useState(false);
    const [modalDiscardCards, setModalDiscardCards] = useState('');

    const takeCardsFromSearch = () => moves.takeCardsFromSearch();
    const takeCardFromSearchDiscard = () => moves.takeCardFromDiscard('search');
    const takeCardFromEndTurnDiscard = () => moves.takeCardFromDiscard('endTurn');

    function showModal(discard) {
        const cards = discard === 'search' ? G.deckDiscardSearch : G.deckDiscardEndTurn;

        let content = '';

        cards.slice().reverse().forEach(c => {
            content += `<img src="${c.imageExpanded}"/>`;
        });

        setModalDiscardCards(<>
            <h3 class="modal-cards-title">{discard === 'search' ? 'DESCARTE DE BUSCA' : 'DESCARTE FIM DE TURNO'}</h3>
            <div class="modal-cards-list" dangerouslySetInnerHTML={{ __html: content }}></div>
        </>);
        setShowDiscardCards(true);
    }

    function closeModal() {
        setModalDiscardCards('');
        setShowDiscardCards(false);
    }

    return (
        <div class="deck">
            <div class="deck-item">
                <b>descarte busca ({G.deckDiscardSearch.length})</b>
                <div class="deck-item-image" onClick={() => showModal('search')}>
                    {!G.deckDiscardSearch.length ?
                        <img src="/images/cover.png" alt="cover card" /> : <img src={G.deckDiscardSearch.slice(-1)[0].image} alt="discard card" />
                    }
                    <i><GiCardPick /></i>
                </div>
                <button
                    hidden={G.deckDiscardSearch.length <= 0 || G.currentAction !== TAKE_CARDS || !isActive}
                    onClick={() => takeCardFromSearchDiscard()}
                >pegar</button>
            </div>
            <div class="deck-item">
                <b>busca ({G.deck.length})</b>
                <div class="deck-item-stack">
                    <img src="/images/cover.png" alt="cover card" />
                    <img src="/images/cover.png" alt="cover card" />
                    <img src="/images/cover.png" alt="cover card" />
                </div>
                <button hidden={G.currentAction !== TAKE_CARDS || !isActive} onClick={() => takeCardsFromSearch(playerID)}>comprar</button>
            </div>
            <div class="deck-item">
                <b>descarte fim turno ({G.deckDiscardEndTurn.length})</b>
                <div class="deck-item-image" onClick={() => showModal('endTurn')}>
                    {!G.deckDiscardEndTurn.length ?
                        <img src="/images/cover.png" alt="cover card" /> : <img src={G.deckDiscardEndTurn.slice(-1)[0].image} alt="discard card" />
                    }
                    <i><GiCardPick /></i>
                </div>
                <button
                    hidden={G.deckDiscardEndTurn.length <= 0 || G.currentAction !== TAKE_CARDS || !isActive}
                    onClick={() => takeCardFromEndTurnDiscard()}
                >pegar</button>
            </div>

            <Modal show={showDiscardCards} content={modalDiscardCards} isCloseable={true} onClose={closeModal} />
        </div>
    );
};

export default Deck;