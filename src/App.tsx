import { useState, useEffect, useRef } from "react";
import Menu from "./Menu";
import CanvasHelper from "./scripts/canvas";
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

	// Simulate data from API
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
			const context = canvasRef.current.getContext("2d");
			if (context) {
				setCanvas(context);
			} else {
				console.log("Failed to get canvas context");
			}
		}
	}, [canvasRef]);

	useEffect(() => {
		if (canvas !== null) {
			init();
		}
	}, [canvas]);

	function init() {
		if (!canvasRef.current || !canvas) {
			return;
		}

		canvasRef.current.width = window.innerWidth;
		canvasRef.current.height = window.innerHeight * 0.8;

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
		if (!canvas || !canvasRef.current) {
			return;
		}

		canvas.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

		cardData.forEach((card) => {
			CanvasHelper.drawCard(canvas, card);
		});

		CanvasHelper.drawLinesBetweenCards(canvas, cardData);
	}

	function zoomIn() {
		if (!canvasRef.current || !canvas) {
			return;
		}

		canvas.scale(1.1, 1.1);
		drawCards();
	}

	function zoomOut() {
		if (!canvasRef.current || !canvas) {
			return;
		}

		canvas.scale(0.9, 0.9);
		drawCards();
	}

	return (
		<div>
			<canvas ref={canvasRef} />
			<Menu zoomIn={zoomIn} zoomOut={zoomOut} />
		</div>
	);
}

export default App;
