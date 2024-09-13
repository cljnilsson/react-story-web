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
    const [lines, setLines] = useState<JSX.Element[]>([]); // Store the lines
    const value = { lastClicked, setLastClicked };

    function handleCardDrag(title: string, newX: number, newY: number) {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.title === title ? { ...card, x: newX, y: newY } : card
            )
        );
    }

    // Draw cards dynamically
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

    // Function to calculate and draw lines between connected cards
    function calculateLines() {
        const arr: JSX.Element[] = [];

        cards.forEach((card) => {
            const cardElement = document.querySelector(`[data-title="${card.title}"]`);
            if (cardElement) {
                const cardRect = cardElement.getBoundingClientRect();

                card.attachedTo.forEach((attachedCardTitle) => {
                    if (attachedCardTitle === card.title) return; // Prevent self-line

                    const attachedCardElement = document.querySelector(`[data-title="${attachedCardTitle}"]`);
                    if (attachedCardElement) {
                        const attachedCardRect = attachedCardElement.getBoundingClientRect();

                        // Calculate the closest points between the two cards
                        const { startX, startY, endX, endY } = getEdgePoints(cardRect, attachedCardRect);

                        // Minimum distance check to avoid drawing lines for overlapping cards
                        const minDistance = 10;
                        const distance = Math.hypot(startX - endX, startY - endY);
                        if (distance > minDistance) {
                            arr.push(
                                <Line
                                    key={`${startX}${startY}${endX}${endY}`}
                                    ax={startX}
                                    ay={startY}
                                    bx={endX}
                                    by={endY}
                                />
                            );
                        }
                    }
                });
            }
        });

        setLines(arr); // Set lines to be rendered
    }

    // Use useEffect to calculate lines after the initial render
    useEffect(() => {
        calculateLines();
    }, [cards]); // Recalculate lines whenever cards change

    return (
        <div>
            <main className="bg-white py-5" style={{ position: "relative", height: "800px" }}>
                <CanvasContext.Provider value={value}>
                    {drawCards()}
                    {lines} {/* Render the lines */}
                </CanvasContext.Provider>
            </main>
            <Menu />
        </div>
    );
}

export default App;

// Helper function to get the nearest edge point of the card
function getEdgePoints(rect1: DOMRect, rect2: DOMRect) {
    const rect1CenterX = rect1.left + rect1.width / 2;
    const rect1CenterY = rect1.top + rect1.height / 2;
    const rect2CenterX = rect2.left + rect2.width / 2;
    const rect2CenterY = rect2.top + rect2.height / 2;

    let startX = rect1CenterX;
    let startY = rect1CenterY;
    let endX = rect2CenterX;
    let endY = rect2CenterY;

    // Determine which side of rect1 to connect based on the position of rect2
    if (rect2CenterX < rect1CenterX) {
        startX = rect1.left; // Left side
        endX = rect2.right;  // Connect to right side of rect2
    } else if (rect2CenterX > rect1CenterX) {
        startX = rect1.right; // Right side
        endX = rect2.left;    // Connect to left side of rect2
    }

    if (rect2CenterY < rect1CenterY) {
        startY = rect1.top; // Top side
        endY = rect2.bottom; // Connect to bottom side of rect2
    } else if (rect2CenterY > rect1CenterY) {
        startY = rect1.bottom; // Bottom side
        endY = rect2.top;      // Connect to top side of rect2
    }

    return { startX, startY, endX, endY };
}
