import { useState } from 'react';
import './Hand.css';
import { DOWN_CARDS } from '../logic/actions';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import Modal from './Modal';
import { isAbleDownCreatures, isAbleExpandCreatures } from '../logic/utils';

const Hand = ({ hand, G, isActive, playerID, enemyPlayerID, moves, isEnemy = false }) => {

    const [selectedCards, setSelectedCards] = useState([]);
    const [showExpandedCard, setShowExpandedCard] = useState(false);
    const [modalExpandedCard, setModalExpandedCard] = useState(<></>);

    function clearSelectedCards() {
        setSelectedCards([]);
    }

    function selectCard(event, card, index) {
        event.preventDefault();
        card.index = index;

        const containsCard = !!selectedCards.find(c => c.index === index);
        if (containsCard) {
            const filtered = selectedCards.filter(c => c.index !== index);
            setSelectedCards(filtered);
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    }

    function showCardExpanded(card) {
        setModalExpandedCard(<img src={card.imageExpanded} alt={card.name} />);
        setShowExpandedCard(true);
    }

    function closeCardExpanded() {
        setModalExpandedCard('');
        setShowExpandedCard(false);
    }

    return (
        <div className={`${isEnemy ? 'hand-enemy' : 'hand'}`}>
            {hand.map((card, index) => (
                <div key={index}
                    className={`${isEnemy ? 'hand-card-enemy' : 'hand-card'} ${selectedCards.find(c => c.index === index) && !isEnemy ? 'selected-card' : ''}`}
                >
                    {!isEnemy && <i onClick={() => showCardExpanded(card)}><HiOutlineArrowsExpand /></i>}
                    {/* {!isEnemy && <b>{card.name}</b>} */}
                    <div onClick={isActive ? e => selectCard(e, card, index) : undefined}>
                        {isEnemy ?
                            <img src="/images/cover.png" alt="cover card" />
                            :
                            <img src={card.image} alt={card.name}  />
                        }
                    </div>
                </div>
            ))}

            {true && <br />}
            {isActive && !isEnemy && <div class="hand-action">
                <button
                    disabled={!isAbleDownCreatures(G, playerID, selectedCards)}
                    hidden={G.currentAction !== DOWN_CARDS || !selectedCards.length || selectedCards.some(c => c.isSong) || !!G.playerAlreadyDownedCreatureCard}
                    onClick={() => {
                        moves.downCreatureCards(selectedCards);
                        clearSelectedCards();
                    }}
                >baixar raça</button>
                <button
                    disabled={!isAbleExpandCreatures(G, playerID, enemyPlayerID, selectedCards)}
                    hidden={G.currentAction !== DOWN_CARDS || !selectedCards.length || selectedCards.some(c => c.isSong)}
                    onClick={() => {
                        moves.expandCreatureCards(enemyPlayerID, selectedCards);
                        clearSelectedCards();
                    }}
                >expandir raça</button>
                <button
                    disabled={selectedCards.length !== 1}
                    hidden={G.currentAction !== DOWN_CARDS || !selectedCards.length || selectedCards.some(c => !c.isSong) || !!G.playerAlreadyDownedSongCard}
                    onClick={() => {
                        moves.downSongCard(selectedCards[0]);
                        clearSelectedCards();
                    }}
                >baixar canção</button>
                <button
                    disabled={selectedCards.length !== 1}
                    hidden={G.currentAction !== DOWN_CARDS}
                    onClick={() => {
                        moves.discardToEndTurn(selectedCards[0].index);
                        clearSelectedCards();
                    }}
                >descarte final turno</button>
            </div>}

            {!isEnemy && <Modal show={showExpandedCard} content={modalExpandedCard} isCloseable={true} onClose={closeCardExpanded} />}
        </div>
    );
};

export default Hand;