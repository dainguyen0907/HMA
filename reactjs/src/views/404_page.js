import React from "react";
import img from "../../src/assets/images/page-not-found.jpg"

export default function PageNotFound(){
    return(
        <div className="w-full h-full">
           <center className="h-full"><img src={img} className="h-full" alt="Page not found"/></center> 
        </div>
    );
}