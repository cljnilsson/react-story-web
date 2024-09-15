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
		setCards((prevCards) => prevCards.map((card) => (card.title === title ? { ...card, x: newX, y: newY } : card)));
	}

	// Draw cards dynamically
	function drawCards() {
		return cardData.map((card) => (
			<Card key={card.title} ix={card.x} iy={card.y} title={card.title} text={card.text} onDrag={(newX, newY) => handleCardDrag(card.title, newX, newY)} />
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
						const { startX, startY, endX, endY } = getClosestPoints(cardRect, attachedCardRect);

						// Add a line between the two points
						arr.push(<Line key={`${startX}${startY}${endX}${endY}`} ax={startX} ay={startY} bx={endX} by={endY} />);
					}
				});
			}
		});

		setLines(arr); // Set the lines to be rendered
	}

	// Get the closest points between the corners or edges of two rectangles
	function getClosestPoints(rect1: DOMRect, rect2: DOMRect) {
		type Point = { x: number; y: number };
		type PointMap = {
			left: Point;
			right: Point;
			top: Point;
			bottom: Point;
			topLeft: Point;
			topRight: Point;
			bottomLeft: Point;
			bottomRight: Point;
		};

		// Calculate the center points of the sides for rect1
		const rect1Points: PointMap = {
			left: { x: rect1.left, y: (rect1.top + rect1.bottom) / 2 },
			right: { x: rect1.right, y: (rect1.top + rect1.bottom) / 2 },
			top: { x: (rect1.left + rect1.right) / 2, y: rect1.top },
			bottom: { x: (rect1.left + rect1.right) / 2, y: rect1.bottom },
			topLeft: { x: rect1.left, y: rect1.top },
			topRight: { x: rect1.right, y: rect1.top },
			bottomLeft: { x: rect1.left, y: rect1.bottom },
			bottomRight: { x: rect1.right, y: rect1.bottom }
		};

		// Calculate the center points of the sides for rect2
		const rect2Points: PointMap = {
			left: { x: rect2.left, y: (rect2.top + rect2.bottom) / 2 },
			right: { x: rect2.right, y: (rect2.top + rect2.bottom) / 2 },
			top: { x: (rect2.left + rect2.right) / 2, y: rect2.top },
			bottom: { x: (rect2.left + rect2.right) / 2, y: rect2.bottom },
			topLeft: { x: rect2.left, y: rect2.top },
			topRight: { x: rect2.right, y: rect2.top },
			bottomLeft: { x: rect2.left, y: rect2.bottom },
			bottomRight: { x: rect2.right, y: rect2.bottom }
		};

		// Find the closest pair of points (either from corners or edges)
		let minDistance = Infinity;
		let startX = 0,
			startY = 0,
			endX = 0,
			endY = 0;

		(Object.keys(rect1Points) as (keyof PointMap)[]).forEach((key1) => {
			(Object.keys(rect2Points) as (keyof PointMap)[]).forEach((key2) => {
				const p1 = rect1Points[key1];
				const p2 = rect2Points[key2];
				const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

				if (distance < minDistance) {
					minDistance = distance;
					startX = p1.x;
					startY = p1.y;
					endX = p2.x;
					endY = p2.y;
				}
			});
		});

		return { startX, startY, endX, endY };
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
