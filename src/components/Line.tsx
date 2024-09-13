import { useState, useContext, forwardRef, useRef, useEffect } from "react";

export default function Line({ax, ay, bx, by}:{ax: number, ay: number, bx: number, by: number}) {
    const length = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
    const angle = Math.atan2(by - ay, bx - ax) * (180 / Math.PI);

    const [css, setCss] = useState<React.CSSProperties>({
		width: `${length}px`,
        transform: `rotate(${angle}deg)`,
        left: `${ax}px`,
        top: `${ay}px`
	});

     return (<div className="line" style={css} />);
}