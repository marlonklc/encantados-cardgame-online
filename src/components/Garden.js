import React from "react";
import './Garden.css';

const Garden = ({ garden, playerID, onSelectCard = () => { }, selectedCard, showSelectedGarden = true }) => {

    function shouldCheckCard(group, index) {
        return selectedCard?.playerID === playerID && selectedCard?.group === group && selectedCard?.index === index;
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
                                <img src={card.image} alt={card.name} />
                            </div>
                            {/* {card.name} */}
                        </li>
                    ))}
                </ul>)
                :
                <></>
            )}
        </div>
    )

};

export default Garden;
