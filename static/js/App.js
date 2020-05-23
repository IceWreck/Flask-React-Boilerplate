import SomeComponent from "./components/SomeComponent";
import React from "react";
import ReactDOM from "react-dom";

const MainPage = () => {
    return <SomeComponent />;
};

ReactDOM.render(<MainPage />, document.getElementById("render-react-here"));
