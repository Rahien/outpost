import Card from "@mui/material/Card";
import { CharacterSheet } from "./components/characterSheet";

function App() {
  return (
    <Card css={{ flexGrow: 1, width: "100%", height: "100%" }}>
      <CharacterSheet />
    </Card>
  );
}

export default App;
