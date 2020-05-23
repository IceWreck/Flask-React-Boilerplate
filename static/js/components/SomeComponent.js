import React from "react";
import logo_image from "../../img/react.png";
const SomeComponent = () => {
    return (
        <div>
            <h1>Hello, this is a react component.</h1>
            <br />
            <img src={logo_image} height="100px" />
        </div>
    );
};

export default SomeComponent;
