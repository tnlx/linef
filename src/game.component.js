import React, { useState } from 'react';
import Score from './score.component'
import Board from './board.component'

export default function Game() {

    const [score, setScore] = useState(0);

    function increaseScore(incr) {
        setScore(score + incr);
    }

    return (
        <div className="game">
            <h1>
                <span style={{ color: 'hsl(250,54%,60%)' }}>L</span>
                <span style={{ color: 'hsl(200,54%,60%)' }}>i</span>
                <span style={{ color: 'hsl(150,54%,60%)' }}>n</span>
                <span style={{ color: 'hsl(100,54%,60%)' }}>e</span>
                <span style={{ color: 'hsl(50,54%,60%)' }}>f</span>
                <span>&nbsp;</span>
                <span style={{ color: 'hsl(0,54%,60%)' }}>•</span>
                <span style={{ color: 'hsl(50,54%,60%)' }}>•</span>
                <span style={{ color: 'hsl(100,54%,60%)' }}>•</span>
                <span style={{ color: 'hsl(150,54%,60%)' }}>•</span>
                <span style={{ color: 'hsl(200,54%,60%)' }}>•</span>
                <span style={{ color: 'hsl(250,54%,60%)' }}>•</span>
                <span style={{ color: 'hsl(300,54%,60%)' }}>•</span>
            </h1>
            <div className="score-board">
                <span>Score: </span>
                <Score score={score} />
            </div>
            <Board w={9} h={9} score_incr={increaseScore} />
        </div>
    );
}