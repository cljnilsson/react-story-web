import { CardData } from '../types/cardData';

export default function Menu(): JSX.Element {

	function updateZoom(zoom: number) {
		//context.scale(zoom, zoom);
		//CanvasHelper.drawCards(context, canvasRef, cardData);
	}

	function zoomIn() {
		updateZoom(1.1);
	}

	function zoomOut() {
		updateZoom(0.9);
	}

    return (
        <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">Other</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomOut}>-</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomIn}>+</button>
        </>
    );
}