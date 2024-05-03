import { useState } from 'react';
import Score from './score.component'
import Board from './board.component'
import ThemeSwitcher from './theme-switcher.component';

export default function Game() {

    const [score, setScore] = useState(0);
    const palette = [
        'var(--ball-1)',
        'var(--ball-2)',
        'var(--ball-3)',
        'var(--ball-4)',
        'var(--ball-5)',
        'var(--ball-6)',
        'var(--ball-7)',
    ];

    function increaseScore(noOfBallsMatched) {
        setScore(score + noOfBallsMatched * (noOfBallsMatched - 1) / 2);
    }

    return (
        <div className="game">
            <div className='heading'>
                <div>
                    <span style={{ color: palette[5] }}>L</span>
                    <span style={{ color: palette[4] }}>i</span>
                    <span style={{ color: palette[3] }}>n</span>
                    <span style={{ color: palette[2] }}>e</span>
                    <span style={{ color: palette[1] }}>f</span>
                    <span>&nbsp;</span>
                    <span style={{ color: palette[0] }}>•</span>
                    <span style={{ color: palette[1] }}>•</span>
                    <span style={{ color: palette[2] }}>•</span>
                    <span style={{ color: palette[3] }}>•</span>
                    <span style={{ color: palette[4] }}>•</span>
                    <span style={{ color: palette[5] }}>•</span>
                    <span style={{ color: palette[6] }}>•</span>
                </div>
                <div>
                    <ThemeSwitcher />
                </div>
            </div>
            <div className="score-board">
                <span>Score: </span>
                <Score score={score} />
            </div>
            <Board w={9} h={9} palette={palette} matched={increaseScore} />
        </div>
    );
}