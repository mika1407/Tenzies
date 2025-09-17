import { useState } from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"

export default function App() {
    const [dice, setDice] = useState(generateAllNewDice())
    
    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    const diceElements = dice.map(dieObj => (
        <Die key={dieObj.id} value={dieObj.value} isHeld={dieObj.isHeld}/>)
    )

    function rollDice() {
        setDice(generateAllNewDice())
    }
    
    return (
        <main>
            <div className="dice-container">
                {diceElements}
            </div>
            
            <button onClick={rollDice} className="roll-dice">Roll Dice</button>
            
        </main>
    )
}