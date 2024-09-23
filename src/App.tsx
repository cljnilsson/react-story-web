import { useState, useEffect, useRef } from "react";
import type { CardData } from "./types/cardData";
import Canvas from "./components/Canvas";

function App() {
	// Simulate data from API
	const cardData: CardData[] = [
		{ x: 50, y: 50, title: "Card 1", text: "Text 1", attachedTo: [] },
		{ x: 450, y: 500, title: "Card 2", text: "Text 2", attachedTo: ["Card 1", "Card 3"] },
		{ x: 850, y: 50, title: "Card 3", text: "Text 3", attachedTo: [] },
		{ x: 1250, y: 50, title: "Card 4", text: "Text 4", attachedTo: [] },
		{ x: 1650, y: 50, title: "Card 5", text: "Text 5", attachedTo: ["Card 4"] }
	];

	return (
		<div>
			<h1>Welcome to the demo!</h1>
			<Canvas cardData={cardData} />
		</div>
	);
}

export default App;
