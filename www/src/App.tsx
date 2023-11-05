import "./App.css";
import "./XTerm.css";
import Terminal from "./Terminal";

function App() {
  return (
    <div style={{width: "1000px"}}>

      <Terminal name="VM Name"  url="localhost:8080" />
    </div>
  );
}

export default App;
