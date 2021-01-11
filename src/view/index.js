import 'regenerator-runtime/runtime'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Grid from './components/Grid'
import LeaderBoard from './components/LeaderBoard'
import SSHS from '../public/images/logo.png'
import { image } from './components/images'

const preload = () => {
    image.forEach((image) => {
        new Image().src = image
    })
}

window.onload = preload

const App = (props) => {
    let highestScoreHistory = window.localStorage.getItem('highestScore')
    const [currentScore, setCurrentScore] = useState(0)
    const [highestScore, setHighestScore] = useState(
        typeof highestScoreHistory !== 'string' ? 0 : highestScoreHistory
    )
    window.localStorage.setItem('highestScore', highestScore.toString())

    const scoreHandler = (score) => {
        setCurrentScore(score)
        if (highestScore < score) {
            window.localStorage.setItem('highestScore', score.toString())
            setHighestScore(score)
        }
    }

    return (
        <div className="card">
            <div className="game-container">
                <div className="header">
                    <img className="logo" src={SSHS}></img>
                    <h1 className="title">GetSSHS</h1>
                    <div className="score-container">
                        <div className="score current">
                            SCORE
                            <br />
                            <span>{currentScore}</span>
                        </div>
                        <div className="score highest">
                            HIGHEST
                            <br />
                            <span>{highestScore}</span>
                        </div>
                    </div>
                </div>
                <div className="explanation">
                    Merge other high schools to reach the almighty{' '}
                    <strong>SSHS!</strong>
                </div>
                <Grid scoreHandler={scoreHandler} />
                <p className="game-info explanation">
                    <strong>HOW TO PLAY:</strong> Use arrow keys and WASD to
                    move the tiles. When two tiles with the same high school
                    logo touch, they <strong>merge into one!</strong>
                    <br />
                    <strong>NOTE:</strong> The order of the high schools are not
                    intended to be a ranking, instead it's a rough
                    south-to-north geographical path to SSHS. This game is a{' '}
                    <a href="http://sshs.hs.kr/index.do">SSHS </a> version of
                    the game 2048.
                </p>
                <hr />
                <p className="explanation">
                    Created by{' '}
                    <a href="https://github.com/james0248">Hyeonseok Jung.</a>{' '}
                    Inspired by{' '}
                    <a href="https://mitchgu.github.io/GetMIT/">GetMIT</a>. It's
                    a clone of{' '}
                    <a href="http://gabrielecirulli.com" target="_blank">
                        2048 by Gabriele Cirulli
                    </a>{' '}
                    made from scratch.
                </p>
                <LeaderBoard />
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App
