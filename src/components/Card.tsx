import { useState, useContext, forwardRef, useRef, useEffect } from "react";
import CanvasContext from "../Context/canvas";

// Wrap the Card component with forwardRef
export default function Card({ ix, iy, title, text, onDrag }: { ix: number; iy: number; title: string; text: string, onDrag?: (x: number, y: number) => void }): JSX.Element {
	const [y, setY] = useState(iy);
	const [x, setX] = useState(ix);
	const [isDragging, setIsDragging] = useState(false);
	const [offset, setOffset] = useState({ offsetX: 0, offsetY: 0 });

	const { lastClicked, setLastClicked } = useContext(CanvasContext);
	const cardRef = useRef<HTMLDivElement>(null); // Reference to the card element
	const parentRef = useRef<HTMLDivElement | null>(null);
	const PADDING = 5;

	const [css, setCss] = useState<React.CSSProperties>({
		left: `${x}px`,
		top: `${y}px`,
		position: "absolute",
		cursor: "grab"
	});

	// Handle mouse down (when the user clicks the card)
	function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
		setLastClicked(title);
		setIsDragging(true);
		setOffset({
			offsetX: e.clientX - x,
			offsetY: e.clientY - y
		});
		setCss((prevCss) => ({
			...prevCss,
			cursor: "grabbing"
		}));
	}

	// Handle mouse move (when the user drags the card)
	function onMouseMove(e: MouseEvent) {
		if (isDragging && cardRef.current && parentRef.current) {
			const parentBounds = parentRef.current.getBoundingClientRect();
			const cardBounds = cardRef.current.getBoundingClientRect();

			// Calculate the new position of the card
			let newX = e.clientX - offset.offsetX;
			let newY = e.clientY - offset.offsetY;

			// Restrict the card to the boundaries of the parent container + 5px padding
			if (newX < PADDING) newX = PADDING; // Left boundary
			if (newY < PADDING) newY = PADDING; // Top boundary
			if (newX + cardBounds.width > parentBounds.width - PADDING) newX = parentBounds.width - cardBounds.width - PADDING; // Right boundary
			if (newY + cardBounds.height > parentBounds.height - PADDING) newY = parentBounds.height - cardBounds.height - PADDING; // Bottom boundary

			setX(newX);
			setY(newY);
			setCss((prevCss) => ({
				...prevCss,
				left: `${newX}px`,
				top: `${newY}px`
			}));

			if(onDrag) {
				onDrag(newX, newY);
			}
		}
	}

	// Handle mouse up (when the user releases the card)
	function onMouseUp() {
		setIsDragging(false);
		setCss((prevCss) => ({
			...prevCss,
			cursor: "grab"
		}));
	}

	// Attach mousemove and mouseup listeners to handle drag behavior
	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		} else {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [isDragging, offset]);

	// Set the parent reference once on mount
	useEffect(() => {
		if (cardRef.current) {
			parentRef.current = cardRef.current.parentElement as HTMLDivElement;
		}
	}, []);

	return (
		<div
			data-title={title}
			ref={cardRef}
			className={"max-w-sm rounded overflow-hidden shadow-lg " + (lastClicked === title ? "outline outline-2 outline-offset-2" : "")}
			style={css}
			onMouseDown={onMouseDown}
		>
			<img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" />
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{title}</div>
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
};