import React, { useState } from "react";
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import './Garden.css';
import Modal from './Modal';

const Garden = ({ garden, playerID, onSelectCard = () => { }, selectedCard, showSelectedGarden = true }) => {

    const [showExpandedCard, setShowExpandedCard] = useState(false);
    const [modalExpandedCard, setModalExpandedCard] = useState(<></>);

    function shouldCheckCard(group, index) {
        return selectedCard?.playerID === playerID && selectedCard?.group === group && selectedCard?.index === index;
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
        <div
            className={`garden ${showSelectedGarden && !!selectedCard && selectedCard.playerID !== playerID ? 'garden-selected' : ''}`}
        >
            {Object.entries(garden).map((group, index1) => group[1].length ?
                (<ul key={index1} class="garden-item">
                    {group[1].map((card, index2) => (
                        <li key={index2}
                            className={`${shouldCheckCard(group[0], index2) ? 'selected-card' : ''}`}
                        >
                            <div onClick={() => onSelectCard({ card, group: group[0], playerID, index: index2 })}>
                                <i onClick={() => showCardExpanded(card)}><HiOutlineArrowsExpand /></i>

                                <img src={card.image} alt={card.name} />
                            </div>
                            {/* {card.name} */}
                        </li>
                    ))}
                </ul>)
                :
                <></>
            )}

            <Modal show={showExpandedCard} content={modalExpandedCard} isCloseable={true} onClose={closeCardExpanded} />
        </div>
    )

};

export default Garden;
