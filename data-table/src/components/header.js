import React, {useState} from "react";

const Tableheader = ({headers, onSort}) => {
    const [sortingField, setSortingField] = useState("");
    const [sortingOrder, setSortingOrder] = useState("asc");

    const onChangeSort = (field) => {
        const order =
            field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
        setSortingField(field);
        setSortingOrder(order);
        onSort(field, order);
    };

    return (
        <thead>
        <tr>
                <th>SourceID</th>
            {headers.map(({name, field, ids})=> (
                <th 
                key = {name}
                onClick={()=> onChangeSort(field)}
                id = {ids}    
                >{name}
                {sortingField && sortingField === field && (
                    <i className={sortingOrder === "asc"
                    ? "fa fa-arrow-down"
                    : "fa fa-arrow-up"} />   
                )}
                </th>
            ))}
            
        </tr>
        </thead>
    );
}
export default Tableheader;