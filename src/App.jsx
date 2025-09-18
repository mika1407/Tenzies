import { useState, useEffect, useRef } from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [time, setTime] = useState(0) // Uusi tila ajastimelle
    const [bestTime, setBestTime] = useState(
        () => Number(localStorage.getItem("bestTime")) || Infinity
    )
    const [isGameActive, setIsGameActive] = useState(false)
    const newGameBtnRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
 
    useEffect(() => {
        if (gameWon && newGameBtnRef.current) {
            newGameBtnRef.current.focus()
        }
    }, [gameWon])

    // Effect for the timer
    useEffect(() => {
        let timerId;
        if (isGameActive && !gameWon) {
            timerId = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
        }
        
        return () => {
            clearInterval(timerId)
        }
    }, [isGameActive, gameWon])

    // Effect for saving best score
    useEffect(() => {
        if (gameWon) {
            if (time < bestTime) {
                setBestTime(time)
                localStorage.setItem("bestTime", time)
            }
        }
    }, [gameWon])
    
    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }

   function rollDice() {
    if (!gameWon) {
        setDice(oldDice => oldDice.map(die => 
            die.isHeld ? 
                die : 
                { ...die, value: Math.ceil(Math.random() * 6) }
        ))
    } else {
        setIsGameActive(false)
        setTime(0); // Nollataan ajastin
        setDice(generateAllNewDice())
    }
   }

    function hold(id) {
        if (!isGameActive) {
            setIsGameActive(true);
        }
           console.log(id)
        setDice(oldDice => oldDice.map(die => 
             die.id === id ? {...die, isHeld: !die.isHeld} : die
        ))
    }

    function clearBestTime() {
        localStorage.removeItem("bestTime")
        setBestTime(Infinity) // Reset bestTime state
    }
 
    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))
    
    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            {!gameWon ? <h1 className="title">Tenzies</h1> : 
                <h3 className="congratulations">Congratulations! You won!</h3>}
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
             
            <div className="game-stats">
                {bestTime !== Infinity && <p className="best-time">Best time: {bestTime}s</p>}
                <p className="timer">Time: {time}s</p>
            </div>

            <div className="dice-container">
                {diceElements}
            </div>

            <button onClick={rollDice} className="roll-dice" ref={newGameBtnRef}>{gameWon ? "New Game" : "Roll"}</button>
        
            {bestTime !== Infinity && (
                <button onClick={clearBestTime} className="clear-best-time-btn">
                    Clear Best Time
                </button>
            )}
        </main>
    )
}