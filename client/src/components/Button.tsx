import React from "react";
import "./button.css";
interface IButtonProps {
    text: string;
    onClick: () => void;
}
const Button:React.FC<IButtonProps> = (props, context) => {
    return (
        <button className={"styleButton"} onClick={props.onClick}>{props.text}</button>
    )
}

export default Button;