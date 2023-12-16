import React from 'react';
import Product from './component/Product';
export default function App() {   
   return (
    <React.Fragment>
    <div className="App">  
    <h1 className='mt-3'>Stanley Martin Homes</h1>  
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
         <Product/>
        </div>
      </div>
    </div>
     
    </div>
    </React.Fragment>
  );
}

