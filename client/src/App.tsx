import React from 'react';
import logo from './logo.svg';
import './App.css';
import Transactions from "./components/Transactions";
import FileUploader from "./components/FileUploader";


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Transactions id={1} />
          <FileUploader key={2} />
      </header>
    </div>
  );
}

export default App;
