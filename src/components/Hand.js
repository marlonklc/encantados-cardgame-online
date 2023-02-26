import { useState } from 'react';
import _ from 'lodash';
import { GROUPS } from '../logic/cards';
import './Hand.css';
import { DOWN_CARDS } from '../logic/actions';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import Modal from './Modal';

const Hand = ({ hand, gardens, G, ctx, isActive, playerID, enemyPlayerID, moves, isEnemy = false }) => {

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

    function shouldDisableDownCreatures() {
        const hasWispsOnGarden = gardens[playerID][GROUPS.wisps].filter(card => card.group === GROUPS.wisps).length >= 2;

        const grouped = _.groupBy(selectedCards, c => c.group);

        if (Object.keys(grouped).length > 2) return true;

        const mimics = Object.keys(grouped).filter(k => k === 'undefined').flatMap(k => grouped[k]);
        const leprechauns = Object.keys(grouped).filter(k => k === GROUPS.leprechauns).flatMap(k => grouped[k]);

        const hasMimicsAmongLeprechauns = !!mimics.length && !!leprechauns.length;
        if (hasMimicsAmongLeprechauns) return true;

        const hasMoreThanOneMimic = mimics.length > 1;
        if (hasMoreThanOneMimic) return true;

        const hasIncompatibleCreatures = Object.keys(grouped).length === 2 && !mimics.length;
        if (hasIncompatibleCreatures) return true;

        return hasWispsOnGarden ? selectedCards.length < 2 : selectedCards.length < 3;
    }

    return (
        <div class="hand">
            {hand.map((card, index) => (
                <div key={index}
                    className={`${isEnemy ? 'hand-card-enemy' : 'hand-card'} ${selectedCards.find(c => c.index === index) && !isEnemy ? 'selected-card' : ''}`}
                >
                    {!isEnemy && <i onClick={() => showCardExpanded(card)}><HiOutlineArrowsExpand /></i>}
                    {!isEnemy && <b>{card.name}</b>}
                    {isEnemy ?
                        <img src="/images/cover.png" alt="cover card" />
                        :
                        <img src={card.image} alt={card.name} onClick={isActive ? e => selectCard(e, card, index) : undefined} />
                    }
                </div>
            ))}

            {isActive && !isEnemy && <div class="hand-action">
                <button
                    disabled={shouldDisableDownCreatures()}
                    hidden={G.currentAction !== DOWN_CARDS || !selectedCards.length || selectedCards.some(c => c.isSong) || !!G.playerAlreadyDownedCreatureCard}
                    onClick={() => {
                        moves.downCreatureCards(selectedCards);
                        clearSelectedCards()
                    }}
                >baixar raça</button>
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