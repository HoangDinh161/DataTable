import './App.css';
import React, { Component } from 'react';
import Table from './components/table';


function App() {
  
    return (
      <div className="App">
        <div className="container">
          <h1 className="text-center">Journals Table</h1>
          <Table />
        </div>
      </div>
    );
  
}


export default App;