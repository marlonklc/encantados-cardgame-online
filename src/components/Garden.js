import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AUTUMN_SONG, GOBLIN, GROUPS, KOBOLD, SPRING_SONG, TROLL } from '../logic/cards';
import './Garden.css';

const Garden = ({ garden, playerID, bgColor, onSelectCard = () => {}, selectedCard, showSelectedGarden = true }) => {

    function shouldCheckCard(group, index) {
        return selectedCard?.playerID === playerID && selectedCard?.group === group && selectedCard?.index === index;
    }

    return (
        <div
            style={{ backgroundColor: bgColor, display: 'flex', width: 'auto', height: '15vh' }}
            className={showSelectedGarden && !!selectedCard && selectedCard.playerID !== playerID ? 'garden-selected' : ''}
        >
            {Object.entries(garden).map((group, index1) => group[1].length ?
                (<ul key={index1} class="garden">
                    {group[1].map((card, index2) => (
                        <li key={index2}
                            className={`garden-card ${shouldCheckCard(group[0], index2) ? 'selected-card' : ''}`}
                            onClick={() => onSelectCard({ card, group: group[0], playerID, index: index2 })}
                        >
                            {card.name} {shouldCheckCard(group[0], index2) ? <>✓</> : ''}
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
