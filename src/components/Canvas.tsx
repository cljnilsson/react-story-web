import { useState, useEffect, useRef } from "react";
import Menu from "./Menu";
import Card from "./Card";
import type { CardData } from "../types/cardData";
import CanvasContext from "../Context/canvas";
import CanvasHelper from "../scripts/canvas";
import Line from "./Line";

export default function Canvas({cardData}: {cardData: CardData[]}) {
	const [cards, setCards] = useState<CardData[]>(cardData);
	const [scale, setScale] = useState(1); // Zoom scale
	const [lastClicked, setLastClicked] = useState("");
	const [lines, setLines] = useState<JSX.Element[]>([]); // Store the lines
	const value = { lastClicked, setLastClicked };

	function handleCardDrag(title: string, newX: number, newY: number) {
		setCards((prevCards) => prevCards.map((card) => (card.title === title ? { ...card, x: newX, y: newY } : card)));
	}

	// Draw cards dynamically
	function drawCards() {
		return cardData.map((card) => (
			<Card key={card.title} ix={card.x} iy={card.y} title={card.title} text={card.text} scale={scale} onDrag={(newX, newY) => handleCardDrag(card.title, newX, newY)} />
		));
	}

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

						// Get the nearest points (either from corners or sides) for both cards
						const { startX, startY, endX, endY } = CanvasHelper.getClosestPoints(cardRect, attachedCardRect);

						// Add a line between the two points
						arr.push(<Line key={`${startX}${startY}${endX}${endY}`} ax={startX} ay={startY} bx={endX} by={endY} />);
					}
				});
			}
		});

		setLines(arr); // Set the lines to be rendered
	}

	// Use useEffect to calculate lines after the initial render
	useEffect(() => {
		calculateLines();
	}, [cards, scale]); // Recalculate lines whenever cards change
	return (
		<div>
			<main className="bg-white py-5" style={{ position: "relative", height: "800px" }}>
				<CanvasContext.Provider value={value}>
					{drawCards()}
					{lines} {/* Render the lines */}
				</CanvasContext.Provider>
			</main>
			<Menu scale={scale} setScale={setScale} />
		</div>
	);
}
