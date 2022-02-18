import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Tableheader from './header'
import Item from './itemcheck'

function Table() {
    const [journals, setjournal] = useState([]);
    const [currentpage, setcurpage] = useState(1);
    const [itemperpage, setitemperpage] = useState(5);
    const [search, setSearch] = useState("");
    const [sortcolm, setsortcolm] = useState({field:"", order: ""});
    //const [filterField] = useState(["country","publisher","year"]);
    const [totalitems, setTotal] = useState(0);
    const options = (["5", "10", "20", "50"]);
    const [col, setcol] = useState([""]);

    const [pageLimitNumber, setLimitNumber] = useState(5);
    const [maxPageLimit, setmaxPageLimit] = useState(5);
    const [minPageLimit, setminPageLimit] = useState(0);
    
    const headers = [
        {name: "Id", field: "id", ids : "id_head"},
        {name: "Title", field: "title", ids: "title_head"},
        {name: "TotalDocs", field: "totalDocs", ids: "totalDocs_head"},
        {name: "Country", field: "country", ids: "country_head"},
        {name: "Publisher", field: "publisher", ids: "publisher_head"},
        {name: "Year", field: "year", ids: "year_head"}
    ]
    
    const searchange = (e) => {
        setSearch(e.target.value);
    }
    const choosepage = (event) => {
        setcurpage(Number(event.target.id));
    }
    
    const pages =[];
    for (let i = 1; i <= Math.ceil(totalitems/itemperpage); i++) {
            pages.push(i);
    }
    const showcol = (colum) => {
        var class_cell = colum +"_col"
        var all_col = document.getElementsByClassName(class_cell);
                for (let i = 0; i < all_col.length; i++) {
                    all_col[i].style.display = "table-cell";
                }
            document.getElementById(colum+"_head").style.display="table-cell";
    }
    const updatedisplay = (colum,hide) => {
        if (hide == "hide") { setcol([...col, colum]);   
        } else {
            setcol((state) => state.filter((column) => column !==colum ));
            showcol(colum); 
        }
    }
    const renderpagenumber = pages.map((nb)=> {
        if (nb < maxPageLimit + 1 && nb > minPageLimit) {
        return (
            <li className= {currentpage == nb? "page-item page-link active" : "page-item page-link"} 
            key = {nb} 
            id = {nb} 
            onClick={choosepage} >
            {nb}
            </li>
        );
        } else {
            return null
        }
    })

    const payload = {"filter":"{}",
        "ignoreAssociation": true,
        "isPaginateDB": true,
        "modelType": "journals",
        "page":1,
        "pageSize":100
      };
    useEffect(() => {
      axios.post('http://o-research-dev.orlab.com.vn/api/v1/filters/filter/', {payload})
        .then(res => {
          setjournal(res.data.data);
          setTotal(res.data.data.length);
        })
        
    }, [])
    const Data = useMemo(() => {
        let data = journals;
        if (search) {
            let lowsearch = search.toLowerCase();
            data = data.filter(
                journal =>
                    journal.title.toLowerCase().includes(lowsearch) ||
                    journal.country.toLocaleLowerCase().includes(lowsearch)||
                    journal.publisher.toLowerCase().includes(lowsearch)||
                    journal.year.toString().toLowerCase().includes(lowsearch)
            )
        }
        if (sortcolm.field) {
            if (sortcolm.order === "asc") {
                data =[...data].sort((a,b)=> 
                    a[sortcolm.field] > b[sortcolm.field] ? 1 : -1
                )    
            }
            if (sortcolm.colm === "desc") {
                data = [...data].sort((a,b)=>
                    a[sortcolm.field] < b[sortcolm.field] ? 1 : -1
                );   
            }  
        }
        setTotal(data.length);

        return data.slice(currentpage*itemperpage - itemperpage,currentpage*itemperpage,);
    } , [journals,search,currentpage,sortcolm,itemperpage]);
    useEffect(() => {
         //console.log(col);
        const hidencolum = col;
        for (let i = 1; i < hidencolum.length; i++) {
            var class_cell = hidencolum[i] + "_col";
            var all_col = document.getElementsByClassName(class_cell);
                for (let i = 0; i < all_col.length; i++) {
                    all_col[i].style.display = "none";
                }
            document.getElementById(hidencolum[i]+"_head").style.display="none";
        }
      },[col,currentpage,itemperpage])

    const prev = () => {
            setcurpage(currentpage -1);
            if ((currentpage -1) % pageLimitNumber == 0) {
            setmaxPageLimit(maxPageLimit - pageLimitNumber);
            setminPageLimit(minPageLimit - pageLimitNumber);
            }
    }  
    const next = () => {
        document.getElementById("next").classList.remove("disabled"); 
        setcurpage(currentpage + 1);
        if ((currentpage + 1) > maxPageLimit) {
            setmaxPageLimit(maxPageLimit + pageLimitNumber);
            setminPageLimit(minPageLimit + pageLimitNumber);
        }
    }
    
  const renderbodytable = (data) => {
    return (
        <tbody>
        {data.map((data, index) =>(
        <tr key={data.id}>
          <td>{data.sourceId}</td>
          <td className="id_col">{data.id}</td>
          <td className='title_col'>{data.title}</td>
          <td className='totalDocs_col'>{data.totalDocs}</td>
          <td className='country_col'>{data.country}</td>
          <td className='publisher_col'>{data.publisher}</td>
          <td className='year_col'>{data.year}</td>
        </tr>
    ))}
        </tbody>
    
    );
}
    const renderoption = () => {
        return (
                    <select value = {itemperpage} className="form-control">
                    {options.map(option => (
                        <option value= {option} > {option}</option>
                    ))}
                    </select>
        );
    }

    return (
        <div className = "data-table">
            <div className = "row">
                <div className = "col-md-4" >
                <input type="text" className="form-control" style={{ width: "350px" }} placeholder="Search"
                value={search} onChange={ searchange}
                /></div>
                <div className="col-md-2 btn-group dropright">
                    <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Display
                    </button>
                <ul className="dropdown-menu">
                {headers.map(({name, field, ids})=> (
                    <li className = "item"><Item id = {field} ids = {ids} onhidechange = {(colum, hidable) => {updatedisplay(colum,hidable)}} /> {name}</li>
                ))
                }
                </ul>
                </div>
                <div className ="col-md-6"></div>
                
            </div>
            <hr style ={{ visibility: "hidden" }}/>
            <div className="table-responsive-md">
            <table className="table table-striped table-bordered table-hover">   
            <Tableheader headers ={headers} onSort = {(field, order)=> {setsortcolm({field, order})}} />
            {renderbodytable(Data)}
            </table></div>
            
            <div className = "row" >
                <div className ="col form-group">
                    <div className = "row">
                <label  className="control-label col-md-2">Shows: </label>
                <select className="form-control col-md-2" value = {itemperpage} onChange= {e => {setitemperpage(e.target.value)}} >
                    {options.map(option => (
                        <option value= {option} > {option}</option>
                    ))}
                </select>
                <div className = "col-md-8"></div>
                    </div>
                </div>
            <div className='col'>
            <ul className="pagination justify-content-end">
                <li >
                <button type="button" className="btn btn-primary" onClick={prev} id = "prev" disabled={currentpage == pages[0]? true : false}>Previous</button>
                </li>
                {renderpagenumber}
                <li >
                <button type="button" className="btn btn-primary" onClick={next} id = "next" disabled={currentpage == pages[pages.length -1]? true : false}>Next</button>
                </li>
            </ul>
            </div>
            </div>
        </div>
      );
    
}

export default Table;