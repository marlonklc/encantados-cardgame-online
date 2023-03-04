import { useState } from 'react';
import './CardList.css';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import Modal from './Modal';

const CardList = ({ cards, maxSelected, onSelectCard = () => { }, children }) => {

    const [selectedCards, setSelectedCards] = useState([]);
    const [showExpandedCard, setShowExpandedCard] = useState(false);
    const [modalExpandedCard, setModalExpandedCard] = useState(<></>);

    function selectCard(event, card, index) {
        event.preventDefault();
        card.index = index;

        const containsCard = !!selectedCards.find(c => c.index === index);
        if (containsCard) {
            const filtered = selectedCards.filter(c => c.index !== index);
            setSelectedCards(filtered);
            onSelectCard(filtered);
        } else {
            if (selectedCards.length >= maxSelected) return;

            const newList = [...selectedCards, card];
            onSelectCard(newList);
            setSelectedCards(newList);
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
        <>
            <div class="card-list">
                {cards.map((card, index) => (
                    <div key={index}
                        className={`card-list-card ${selectedCards.find(c => c.index === index) ? 'selected-card' : ''}`}
                    >
                        <i onClick={() => showCardExpanded(card)}><HiOutlineArrowsExpand /></i>
                        {/* <b>{card.name}</b> */}
                        <div onClick={e => selectCard(e, card, index)}>
                            <img src={card.image} alt={card.name} />
                        </div>
                    </div>
                ))}


            </div>
            <div class="card-list-actions">
                {children}
            </div>

            <Modal show={showExpandedCard} zIndex={'99999'} content={modalExpandedCard} isCloseable={true} onClose={closeCardExpanded} />
        </>
    );
};

export default CardList;