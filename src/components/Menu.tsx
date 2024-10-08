import { CardData } from '../types/cardData';

export default function Menu({scale, setScale}): JSX.Element {
	function zoomIn() {
		setScale(1.1);
	}

	function zoomOut() {
		setScale(0.9);
	}

	function zoomReset() {
		setScale(1);
	}

    return (
        <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomReset}>Reset</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomOut}>-</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomIn}>+</button>
			scale: {scale}
        </>
    );
}