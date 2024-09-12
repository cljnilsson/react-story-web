import { createContext } from "react";

const canvasContext = createContext({
    lastClicked: "",
    setLastClicked: (title: string) => {},
});

export default canvasContext;