import { useState } from "react";
import { CharacterSelect } from "./components/characterSelect";
import { Character } from "./types";
import { characters } from "./characters";

function App() {
  const [character, setCharacter] = useState<Character>(
    characters["blinkblade"]
  );
  return (
    <div className="App">
      outpost app
      <CharacterSelect character={character} onChange={setCharacter} />
    </div>
  );
}

export default App;
