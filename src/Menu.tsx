interface MenuProps {
    zoomIn: () => void;
    zoomOut: () => void;
}

export default function Menu({ zoomIn, zoomOut }: MenuProps): JSX.Element {
    return (
        <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">Other</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomOut}>-</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={zoomIn}>+</button>
        </>
    );
}