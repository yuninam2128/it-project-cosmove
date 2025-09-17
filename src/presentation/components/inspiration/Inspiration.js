import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cardData } from '../../../data/cards/CardIndex';
import './Inspiration.css';

function Inspiration() {
    const [showPopup, setShowPopup] = useState(false);
    const [randomCard, setRandomCard] = useState(null);

    const handleCardClick = useCallback(() => {
        if (!cardData || cardData.length === 0) {
            console.error('No inspiration cards available');
            return;
        }

        // Generate random index and select card
        const randomIndex = Math.floor(Math.random() * cardData.length);
        const selectedCard = cardData[randomIndex];

        setRandomCard(selectedCard);
        setShowPopup(true);
    }, []);

    const closePopup = useCallback(() => {
        setShowPopup(false);
        setRandomCard(null);
    }, []);

    // Handle keyboard events for accessibility
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardClick();
        }
    };

    const handleModalKeyDown = (event) => {
        if (event.key === 'Escape') {
            closePopup();
        }
    };

    return (
        <>
            <div 
                className="inspiration-container" 
                onClick={handleCardClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label="영감카드를 얻으려면 클릭하세요"
            >
                <h3>영감카드</h3>
                <p>클릭해서 오늘의 영감을 얻어보세요!</p>
            </div>

            {showPopup && randomCard && createPortal(
                <div 
                    className="modal-overlay" 
                    onClick={closePopup}
                    onKeyDown={handleModalKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inspiration-card"
                >
                    <div 
                        className="modal inspiration-popup" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-content">
                            <h4>{randomCard.title}</h4>
                            <img 
                                src={randomCard.image} 
                                alt={randomCard.title || "오늘의 영감 카드"} 
                                id="inspiration-card"
                                onError={(e) => {
                                    e.target.src = '/path/to/fallback-image.jpg'; // 대체 이미지 경로
                                    console.error('Failed to load inspiration card image');
                                }}
                            />
                            <p className="card-description">{randomCard.description}</p>
                        </div>
                        <button 
                            onClick={closePopup}
                            autoFocus
                            aria-label="팝업 닫기"
                        >
                            닫기
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Inspiration;