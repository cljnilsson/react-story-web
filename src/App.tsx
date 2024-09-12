import { useState, useEffect, useRef } from "react";
import Card from "./Card";
import "./App.css";

function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current.getContext("2d");

			if (canvas === null) {
				return;
			}

			canvasRef.current.width = window.innerWidth;
			canvasRef.current.height = window.innerHeight;

			// Example: Drawing multiple cards on the canvas
			const cardData = [
				{ x: 50, y: 50, width: 260, height: 360, title: "Card 1", text: "Text 1", attachedTo: [] },
				{ x: 350, y: 500, width: 260, height: 360, title: "Card 2", text: "Text 2", attachedTo: ["Card 1", "Card 3"] },
				{ x: 650, y: 50, width: 260, height: 360, title: "Card 3", text: "Text 3", attachedTo: [] },
				{ x: 950, y: 50, width: 260, height: 360, title: "Card 4", text: "Text 4", attachedTo: [] },
				{ x: 1250, y: 50, width: 260, height: 360, title: "Card 5", text: "Text 5", attachedTo: ["Card 4"] }
				// Add more cards as needed
			];

			// Loop through each card data and draw it on the canvas
			cardData.forEach((card) => {
				Card({
					ctx: canvas,
					x: card.x,
					y: card.y,
					width: card.width,
					height: card.height,
					title: card.title,
					text: card.text
				});
			});

			drawLinesBetweenCards(canvas, cardData);

			function drawLinesBetweenCards(ctx: CanvasRenderingContext2D, cardData: { x: number; y: number; width: number; height: number; title: string; attachedTo: string[] }[]) {
				ctx.strokeStyle = "#333"; // Line color
				ctx.lineWidth = 2; // Line width
			
				// Create a map for quick access to card positions by title
				const cardMap = new Map<string, { x: number; y: number; width: number; height: number }>();
				for (const card of cardData) {
					cardMap.set(card.title, { x: card.x, y: card.y, width: card.width, height: card.height });
				}
			
				// Iterate over each card and draw lines to cards in its `attachedTo` array
				for (const card of cardData) {
					const startX = card.x + card.width / 2;
					const startY = card.y + card.height / 2;
			
					for (const attachedTitle of card.attachedTo) {
						const attachedCard = cardMap.get(attachedTitle);
						if (attachedCard) {
							const endX = attachedCard.x + attachedCard.width / 2;
							const endY = attachedCard.y + attachedCard.height / 2;
			
							ctx.beginPath();
							ctx.moveTo(startX, startY);
							ctx.lineTo(endX, endY);
							ctx.stroke();
						}
					}
				}
			}
		}
	}, []);

	return (
		<div>
			<canvas ref={canvasRef} />
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Test</button>
		</div>
	);
}

export default App;
