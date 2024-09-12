import { useState, useEffect, useRef, createContext } from "react";
import Menu from "./components/Menu";
import Card from "./components/Card";
import type { CardData } from "./types/cardData";
import CanvasContext from "./Context/canvas";

function App() {
	// Simulate data from API
	const cardData: CardData[] = [
		{ x: 50, y: 50, width: 260, height: 360, title: "Card 1", text: "Text 1", attachedTo: [] },
		{ x: 350, y: 500, width: 260, height: 360, title: "Card 2", text: "Text 2", attachedTo: ["Card 1", "Card 3"] },
		{ x: 650, y: 50, width: 260, height: 360, title: "Card 3", text: "Text 3", attachedTo: [] },
		{ x: 950, y: 50, width: 260, height: 360, title: "Card 4", text: "Text 4", attachedTo: [] },
		{ x: 1250, y: 50, width: 260, height: 360, title: "Card 5", text: "Text 5", attachedTo: ["Card 4"] }
		// Add more cards as needed
	];

	const [lastClicked, setLastClicked] = useState("");
  	const value = { lastClicked, setLastClicked };

	function drawCards() {
		return cardData.map((card) => {
			return <Card key={card.title} ix={card.x} iy={card.y} title={card.title} text={card.text} />;
		});
	}

	return (
		<div>
			<main className="bg-white py-5">
				<CanvasContext.Provider value={value}>
					{drawCards()}
				</CanvasContext.Provider>
			</main>
			<Menu />
		</div>
	);
}

export default App;
