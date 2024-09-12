import { useState, useContext } from "react";
import CanvasContext from "../Context/canvas";

export default function Card({ ix, iy, title, text }: { ix: number; iy: number; title: string; text: string }): JSX.Element {
	const [y, setY] = useState(iy);
	const [x, setX] = useState(ix);
	//const [selected, setSelected] = useState(false);

	const { lastClicked, setLastClicked } = useContext(CanvasContext);

	const [css, setCss] = useState<React.CSSProperties>({
		left: `${x}px`,
		top: `${y}px`,
		position: "relative"
	});

	function onClick() {
		setLastClicked(title);
	}

	return (
		<div className={"max-w-sm rounded overflow-hidden shadow-lg " + (lastClicked === title ? "outline outline-2 outline-offset-2" : "")} style={css} onClick={onClick}>
			<img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" />
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">The Coldest Sunset</div>
				<p className="text-gray-700 text-base">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
				</p>
			</div>
			<div className="px-6 pt-4 pb-2">
				<span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
				<span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
				<span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
			</div>
		</div>
	);
}
