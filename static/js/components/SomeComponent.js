import React from "react";
import logo_image from "../../img/react.png";
import "./SomeStyle.css";

const SomeComponent = () => {
    return (
        <div>
            <p>
                <h1 className="some-style-class">Hello, this is a react component.</h1>
                <br />
                <img src={logo_image} height="100px" />
            </p>
        </div>
    );
};

export default SomeComponent;
