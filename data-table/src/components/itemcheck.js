import React, { useState } from 'react';

const Item= ({ id , ids , onhidechange}) => {
    const[hidable, sethidable] = useState("hide");
    const[colm, setcolm] = useState(id);
    
    const  display = (id) =>  {
        if (hidable == "hide") {
            sethidable("show")
        } else {
            sethidable("hide")
        }
        onhidechange(colm, hidable);
        //console.log( "Doi: " +colm + hidable);
    }
    return (
        <input type="checkbox" value={hidable} key={ids} id= {colm} onChange ={e => display(e.target.id)} />
    );
}

export default Item;