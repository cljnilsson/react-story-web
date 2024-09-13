import { useState, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import Card from "./components/Card";
import type { CardData } from "./types/cardData";
import CanvasContext from "./Context/canvas";
import Line from "./components/Line";

function App() {
    // Simulate data from API
    const cardData: CardData[] = [
        { x: 50, y: 50, title: "Card 1", text: "Text 1", attachedTo: [] },
        { x: 450, y: 500, title: "Card 2", text: "Text 2", attachedTo: ["Card 1", "Card 3"] },
        { x: 850, y: 50, title: "Card 3", text: "Text 3", attachedTo: [] },
        { x: 1250, y: 50, title: "Card 4", text: "Text 4", attachedTo: [] },
        { x: 1650, y: 50, title: "Card 5", text: "Text 5", attachedTo: ["Card 4"] }
    ];

	const [cards, setCards] = useState<CardData[]>(cardData);
    const [lastClicked, setLastClicked] = useState("");
    const value = { lastClicked, setLastClicked };

	function handleCardDrag(title: string, newX: number, newY: number) {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.title === title ? { ...card, x: newX, y: newY } : card
            )
        );
    }

    function drawCards() {
        return cardData.map((card) => (
            <Card
                key={card.title}
                ix={card.x}
                iy={card.y}
                title={card.title}
                text={card.text}
				onDrag={(newX, newY) => handleCardDrag(card.title, newX, newY)}
            />
        ));
    }

	function drawLines() {
		const arr: JSX.Element[] = [];
		cardData.forEach((card) => {
            const cardElement = document.querySelector(`[data-title="${card.title}"]`);
            if (cardElement) {
                const cardRect = cardElement.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;

                card.attachedTo.forEach((attachedCardTitle) => {
                    const attachedCardElement = document.querySelector(`[data-title="${attachedCardTitle}"]`);
                    if (attachedCardElement) {
                        const attachedCardRect = attachedCardElement.getBoundingClientRect();
                        const attachedCardCenterX = attachedCardRect.left + attachedCardRect.width / 2;
                        const attachedCardCenterY = attachedCardRect.top + attachedCardRect.height / 2;
						arr.push(<Line key={`${cardCenterX}${cardCenterY}${attachedCardCenterX}${attachedCardCenterY}`} ax={cardCenterX} ay={cardCenterY} bx={attachedCardCenterX} by={attachedCardCenterY} />);
                    }
                });
            }
        });

		return arr;
	}

    return (
        <div>
            <main className="bg-white py-5" style={{ position: "relative", height: "800px" }}>
				<CanvasContext.Provider value={value}>
					{drawCards()}
					{drawLines()}
				</CanvasContext.Provider>
            </main>
            <Menu />
        </div>
    );
}

export default App;
