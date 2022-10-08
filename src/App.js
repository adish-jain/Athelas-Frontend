import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import UploadImage from './UploadImage'

function App() {
  return (
    <div className="App">
      <header className="App-header">
       <p>Athelas Coding Test</p>
       <UploadImage />
      </header>
    </div>
  );
}

export default App;
