import { useState, useEffect, useRef } from "react";
import Card from "./Card";
import "./App.css";

// define a Card type here
type CardData = {
	x: number;
	y: number;
	width: number;
	height: number;
	title: string;
	text: string;
	attachedTo: string[];
};

function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvas, setCanvas] = useState<CanvasRenderingContext2D | null>(null);

	const cardData: CardData[] = [
		{ x: 50, y: 50, width: 260, height: 360, title: "Card 1", text: "Text 1", attachedTo: [] },
		{ x: 350, y: 500, width: 260, height: 360, title: "Card 2", text: "Text 2", attachedTo: ["Card 1", "Card 3"] },
		{ x: 650, y: 50, width: 260, height: 360, title: "Card 3", text: "Text 3", attachedTo: [] },
		{ x: 950, y: 50, width: 260, height: 360, title: "Card 4", text: "Text 4", attachedTo: [] },
		{ x: 1250, y: 50, width: 260, height: 360, title: "Card 5", text: "Text 5", attachedTo: ["Card 4"] }
		// Add more cards as needed
	];

	useEffect(() => {
		if (canvasRef.current) {
			setCanvas(canvasRef.current.getContext("2d"));

			if (canvas === null) {
				return;
			}

			init();
		}
	}, []);

	function init() {
		if (!canvasRef.current || !canvas) {
			return;
		}

		canvasRef.current.width = window.innerWidth;
		canvasRef.current.height = window.innerHeight;

		drawCards();

		let offsetY = 0;
		let isDragging = false;
		let draggedCard: CardData | null = null;
		let offsetX = 0;

		// Mouse down event: Detect card click and start dragging
		canvasRef.current.addEventListener("mousedown", (e) => {
			const mouseX = e.offsetX;
			const mouseY = e.offsetY;

			// Check if the mouse is over any card
			for (const card of cardData) {
				if (mouseX >= card.x && mouseX <= card.x + card.width && mouseY >= card.y && mouseY <= card.y + card.height) {
					isDragging = true;
					draggedCard = card;
					offsetX = mouseX - card.x;
					offsetY = mouseY - card.y;
					break;
				}
			}
		});

		// Mouse move event: Move the dragged card
		canvasRef.current.addEventListener("mousemove", (e) => {
			if (isDragging && draggedCard) {
				const mouseX = e.offsetX;
				const mouseY = e.offsetY;

				// Update the dragged card's position
				draggedCard.x = mouseX - offsetX;
				draggedCard.y = mouseY - offsetY;

				// Clear and redraw the canvas
				drawCards();
			}
		});

		// Mouse up event: Stop dragging
		canvasRef.current.addEventListener("mouseup", () => {
			isDragging = false;
			draggedCard = null;
		});
	}

	function drawCards() {
		if(!canvas || !canvasRef.current) {
			return;
		}

		canvas.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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

		drawLinesBetweenCards(canvas);
	}

	function drawLinesBetweenCards(
		ctx: CanvasRenderingContext2D
	) {
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

	return (
		<div>
			<canvas ref={canvasRef} />
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Test</button>
		</div>
	);
}

export default App;
