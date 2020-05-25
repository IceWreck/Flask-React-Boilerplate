import SomeComponent from "./components/SomeComponent";
import React from "react";
import ReactDOM from "react-dom";

const SomePage = () => {
    return <SomeComponent />;
};

ReactDOM.render(<SomePage />, document.getElementById("render-react-here"));
