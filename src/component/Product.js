import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import JsonData from './data.json';

export default function Product()
{
    const columns = [
        {
            name:"Product Name",
            selector:(row)=>row.productName,
        },
        {
            name:"Product ID",
            selector:(row)=>row.productID,
        },
        {
            name:"MetroArea Title",
            selector:(row)=>row.metroArea,
        },
        {
            name:"Full Name",
            selector:(row)=>row.fullName,
        },
        {
            name:"Project Group ID",
            selector:(row)=>row.projectGroupID,
        },
    ];

    const metroTableColumns = [
        {
            name:"MetroAreaID",
            selector:(row)=>row.MetroAreaID,
        },
        {
            name:"MetroAreaTitle",
            selector:(row)=>row.MetroAreaTitle,
        },
        {
            name:"MetroAreaStateAbr",
            selector:(row)=>row.MetroAreaStateAbr,
        },
        {
            name:"MetroAreaStateName",
            selector:(row)=>row.MetroAreaStateName,
        },
    ];

    const projectTableColumns = [
        {
            name:"ProjectGroupID",
            selector:(row)=>row.ProjectGroupID,
        },
        {
            name:"MetroAreaID",
            selector:(row)=>row.MetroAreaID,
        },
        {
            name:"FullName",
            selector:(row)=>row.FullName,
        },
        {
            name:"Status",
            selector:(row)=>row.Status,
        },
    ];

    const productTableColumns = [
        {
            name:"ProjectName",
            selector:(row)=>row.ProjectName,
        },
        {
            name:"ProductID",
            selector:(row)=>row.ProductID,
        },
        {
            name:"ProjectGroupID",
            selector:(row)=>row.ProjectGroupID,
        },
        {
            name:"ProductName",
            selector:(row)=>row.ProductName,
        },
    ];

    const [metroTableData, setMetroTableData]= useState([]);
    const [projectTabledata, setProjectTabledata]= useState([]);
    const [productTableData, setProductTableData]= useState([]);
    const [data, setData]= useState([]);
    const [search, SetSearch]= useState('');
    const [filter, setFilter]= useState([]);

    const getProduct=async()=>{
    try{
        const req = await fetch("https://fakestoreapi.com/products");
        const res = await req.json();
        console.log(res);
        setMetroTableData(JsonData.metro);
        setProjectTabledata(JsonData.project);
        setProductTableData(JsonData.product);
        const formattedData = [];
        Object.keys(JsonData).forEach(key => formattedData.push({name: key, value: JsonData[key]}));
        setData(formattedData);
    } catch(error){
       console.log(error);
    }
    }
    useEffect(()=>{
        getProduct();
    }, []);

    useEffect(()=>{
        let response = [];
        let searchResults = {}
        data.map((item)=> {
            const keyValuePair = [];
            item.value.map((eachRow) => 
            {
                var itemFound = false;
                //Object.keys(eachRow).forEach(key => keyValuePair.push({name: key, value: eachRow[key]}));
                Object.keys(eachRow).forEach(key =>
                {
                    if (!itemFound && eachRow[key].includes(search)) {
                        keyValuePair.push(eachRow);
                        itemFound = true;
                    }
                }); 
            });
            searchResults[item.name] = keyValuePair;
        });
        console.log("Result!!!")
        console.log(searchResults);
        Object.keys(searchResults).forEach(key => {
            if (searchResults[key].length > 0) {
                
            } 
        });
        let projectResults = searchResults['project'];
        let productResults = searchResults['product'];

        if (searchResults.hasOwnProperty('metro'))
        {
            let metroResults = searchResults['metro'];
            metroResults.map(eachRow => {
                let metroAreaID = eachRow['MetroAreaID'];
                let metroAreaTitle = eachRow['MetroAreaTitle'];
                let filteredProjectTable = projectTabledata.filter(eachProjectRow => {
                    return eachProjectRow['MetroAreaID'] == metroAreaID;
                });

                let filteredProductTable = productTableData.filter(eachProductRow => {
                    return filteredProjectTable.map(function(item){return item.ProjectGroupID;}).includes(eachProductRow.ProjectGroupID);
                });

                filteredProductTable.map(productItem => {
                    let responseObj = {};
                    responseObj['productName'] = productItem['ProductName'];
                    responseObj['productID'] = productItem['ProductID'];
                    responseObj['metroArea'] = metroAreaTitle;
                    responseObj['fullName'] = filteredProjectTable.filter(item =>
                    {
                        if (item.ProjectGroupID === productItem['ProjectGroupID']) {
                            return true;
                        }
                        return false;
                    })[0]['FullName'];
                    responseObj['projectGroupID'] = productItem['ProjectGroupID'];

                    response.push(responseObj);
                });
                // productName, productID, metroArea, fullName, projectGroupID
            });
        }

        if (searchResults.hasOwnProperty('project'))
        {
            let projectResults = searchResults['project'];
            projectResults.map(eachRow => {
                let projectGroupID = eachRow['ProjectGroupID'];
                let fullName = eachRow['FullName'];
                let metroAreaTitle = metroTableData.filter(item =>
                {
                    if(item.MetroAreaID === eachRow['MetroAreaID']) {
                        return true;
                    }
                    return false;
                })[0]['MetroAreaTitle'];

                productTableData.map(eachProductRow => {
                    if ((projectGroupID === eachProductRow.projectGroupID) && !(
                        response.map(function(item){return item.productID;}).includes(eachProductRow['ProductID']))) {
                        let responseObj = {};
                        responseObj['productName'] = eachProductRow['ProductName'];
                        responseObj['productID'] = eachProductRow['ProductID'];
                        responseObj['metroArea'] = metroAreaTitle;
                        responseObj['fullName'] = fullName;
                        responseObj['projectGroupID'] = projectGroupID;
                        response.push(responseObj);
                    }
                });
            });
        }
        
        if (searchResults.hasOwnProperty('product'))
        {
            let productResults = searchResults['product'];
            productResults.map(eachProductRow => {
                if (!(response.map(function(item){return item.productID;}).includes(eachProductRow['ProductID']))) {
                    let responseObj = {};
                    responseObj['productName'] = eachProductRow['ProductName'];
                    responseObj['productID'] = eachProductRow['ProductID'];
                    responseObj['projectGroupID'] = eachProductRow['ProjectGroupID'];
                    projectTabledata.map(item =>
                    {
                        if(item.ProjectGroupID === eachProductRow['ProjectGroupID']) {
                            responseObj['fullName'] = item.FullName;
                            metroTableData.map(metroItem => {
                                if (item.MetroAreaID === metroItem.MetroAreaID) {
                                    responseObj['metroArea'] = metroItem.MetroAreaTitle;
                                }
                            });
                        }
                    });
                    response.push(responseObj);
                }
            });
        }

        response = response.filter(item => {
            if (item.productName.toUpperCase() === 'NULL' ||
                item.productID.toUpperCase() === 'NULL' ||
                item.projectGroupID.toUpperCase() === 'NULL' ||
                item.fullName.toUpperCase() === 'NULL' ||
                item.metroArea.toUpperCase() === 'NULL') {
                    return false;
                }
                return true;
        });

        response.sort(function(a, b) {
            var textA = a.productName.toUpperCase();
            var textB = b.productName.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        setFilter(response);
    },[search]);
   
   const tableHeaderstyle={
    headCells:{
        style:{
            fontWeight:"bold",
            fontSize:"14px",
            backgroundColor:"#ccc"
        },
    },
   }

    return(
        <React.Fragment>
            <h3>Product List Search</h3>
            <br></br>
            <h5>Metro Table</h5>
            <DataTable 
                customStyles={ tableHeaderstyle }
                columns={ metroTableColumns }
                data={ metroTableData }
                pagination
                fixedHeader
                selectableRowsHighlight
                highlightOnHover
            />
            <br></br>
            <h5>Project Table</h5>
            <DataTable 
                customStyles={ tableHeaderstyle }
                columns={ projectTableColumns }
                data={ projectTabledata }
                pagination
                fixedHeader
                selectableRowsHighlight
                highlightOnHover
            />

            <br></br>
            <h5>Product Table</h5>
            <DataTable 
                customStyles={ tableHeaderstyle }
                columns={ productTableColumns }
                data={ productTableData }
                pagination
                fixedHeader
                selectableRowsHighlight
                highlightOnHover
            />

            <br></br>
            <h5>Search Results</h5>
            <DataTable 
                customStyles={ tableHeaderstyle }
                columns={ columns }
                data={ filter }
                pagination
                fixedHeader
                selectableRowsHighlight
                highlightOnHover
                subHeader
                subHeaderComponent={
                    <input type="text"
                    className="w-25 form-control"
                    placeholder="Search..."
                    value={ search }
                    onChange={(e)=>SetSearch(e.target.value)}
                    />
                }
                subHeaderAlign="center"
            />
        </React.Fragment>
    );
}