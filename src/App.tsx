import { useState, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import Card from "./components/Card";
import type { CardData } from "./types/cardData";
import CanvasContext from "./Context/canvas";

function App() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Simulate data from API
    const cardData: CardData[] = [
        { x: 50, y: 50, title: "Card 1", text: "Text 1", attachedTo: [] },
        { x: 450, y: 500, title: "Card 2", text: "Text 2", attachedTo: ["Card 1", "Card 3"] },
        { x: 850, y: 50, title: "Card 3", text: "Text 3", attachedTo: [] },
        { x: 1250, y: 50, title: "Card 4", text: "Text 4", attachedTo: [] },
        { x: 1650, y: 50, title: "Card 5", text: "Text 5", attachedTo: ["Card 4"] }
    ];

    const [lastClicked, setLastClicked] = useState("");
    const value = { lastClicked, setLastClicked };

    function drawLine(ax: number, ay: number, bx: number, by: number) {
        if (containerRef.current) {
            // Calculate the angle and length between two points
            const length = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
            let angle = Math.atan2(by - ay, bx - ax) * (180 / Math.PI);

            const line = document.createElement("div");
            line.style.position = "absolute";
            line.style.backgroundColor = "black";
            line.style.height = "1px";
            line.style.width = `${length}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = "0 0";
            line.style.left = `${ax}px`;
            line.style.top = `${ay}px`;
            line.style.zIndex = "99";

            containerRef.current.appendChild(line);
        }
    }

    function drawConnections() {
        // Loop through each card to draw the lines
        cardData.forEach((card) => {
			console.log("woo")
            const cardElement = cardRefs.current[card.title];
            if (cardElement) {
                const cardRect = cardElement.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;

                // Loop through attached cards and draw lines
                card.attachedTo.forEach((attachedCardTitle) => {
                    const attachedCardElement = cardRefs.current[attachedCardTitle];
                    if (attachedCardElement) {
                        const attachedCardRect = attachedCardElement.getBoundingClientRect();
                        const attachedCardCenterX = attachedCardRect.left + attachedCardRect.width / 2;
                        const attachedCardCenterY = attachedCardRect.top + attachedCardRect.height / 2;

                        // Draw line between card and attached card
                        drawLine(cardCenterX, cardCenterY, attachedCardCenterX, attachedCardCenterY);
						console.log("wop wop")
                    }
                });
            }
        });
    }

    useEffect(() => {
        // Clear previous lines
        if (containerRef.current) {
            //containerRef.current.innerHTML = "";
        }
       drawConnections();
    }, [cardData, lastClicked]);

    function drawCards() {
        return cardData.map((card) => (
            <Card
                key={card.title}
                ix={card.x}
                iy={card.y}
                title={card.title}
                text={card.text}
                ref={(el: HTMLDivElement | null) => {
                    cardRefs.current[card.title] = el;
                    console.log(`Card "${card.title}" has ref:`, el); // Debugging line to ensure ref is attached
                }} // Assign each card to cardRefs
            />
        ));
    }

    return (
        <div>
            <main className="bg-white py-5" style={{ position: "relative", height: "800px" }} ref={containerRef}>
				<CanvasContext.Provider value={value}>{drawCards()}</CanvasContext.Provider>
            </main>
            <Menu />
        </div>
    );
}

export default App;
