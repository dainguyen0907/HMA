import { FloatingLabel } from "flowbite-react";
import React from "react";

export default function FloatTextComponent(props){
    //props: label, data, setData, type

    const onHandleTextBox=(e)=>{
        console.log(e.target.value)
        props.setData(e.target.value);
    }

    return(
        <FloatingLabel variant="outlined" label={props.label} onChange={onHandleTextBox} value={props.data} type={props.type} helperText={props.helper}/>
    );
}