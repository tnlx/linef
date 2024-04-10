import React, { useState } from 'react';
import Score from './score.component'
import Board from './board.component'


export default function Game() {

    const [score, setScore] = useState(0);
    const palette = [
        'hsl(0,54%,60%)',
        'hsl(50,54%,60%)',
        'hsl(100,54%,60%)',
        'hsl(150,54%,60%)',
        'hsl(200,54%,60%)',
        'hsl(250,54%,60%)',
        'hsl(300,54%,60%)',
    ]

    function increaseScore(noOfBallsMatched) {
        setScore(score + noOfBallsMatched * (noOfBallsMatched - 1) / 2);
    }

    return (
        <div className="game">
            <h1>
                <span style={{ color: palette[5] }}>L</span>
                <span style={{ color: palette[4] }}>i</span>
                <span style={{ color: palette[3] }}>n</span>
                <span style={{ color: palette[2] }}>e</span>
                <span style={{ color: palette[1] }}>f</span>
                <span>&nbsp;</span>
                <span style={{ color: palette[0]}}>•</span>
                <span style={{ color: palette[1] }}>•</span>
                <span style={{ color: palette[2] }}>•</span>
                <span style={{ color: palette[3] }}>•</span>
                <span style={{ color: palette[4] }}>•</span>
                <span style={{ color: palette[5] }}>•</span>
                <span style={{ color: palette[6] }}>•</span>
            </h1>
            <div className="score-board">
                <span>Score: </span>
                <Score score={score} />
            </div>
            <Board w={9} h={9} palette={palette} matched={increaseScore} />
        </div>
    );
}