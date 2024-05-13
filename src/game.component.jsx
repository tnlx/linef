import { useState } from 'react';
import Score from './score.component'
import Board from './board.component'
import ThemeSwitcher from './theme-switcher.component';
import RefreshIcon from './refresh';
import { randomIndices } from './utils';
import BallProp from './ballprop';
import { match } from './matcher';

export default function Game() {

    const w = 9;
    const h = 9;
    const noRandomF = 3;
    const noRandomP = 5; // at initialization
    const palette = [
        'var(--ball-1)',
        'var(--ball-2)',
        'var(--ball-3)',
        'var(--ball-4)',
        'var(--ball-5)',
        'var(--ball-6)',
        'var(--ball-7)',
    ];
    const [squares, setSquare] = useState(initArray());
    const [nextBalls, setNextBalls] = useState(initNextBalls(squares));
    const [score, setScore] = useState(0);

    function restart() {
        const nSquares = initArray();
        setSquare(nSquares);
        setNextBalls(initNextBalls(nSquares));
        setScore(0);
    }

    function randomColor() {
        return palette[Math.floor(Math.random() * palette.length)];
    }

    function initArray() {
        let arr = Array(w * h).fill(null);
        randomIndices(noRandomP, arr, () => true)
            .map(ri => arr[ri] = BallProp.of(randomColor()));
        return arr
    }

    function initNextBalls(squares) {
        return randomIndices(noRandomF, squares, (arr, i) => !arr[i])
            .map(ri => {
                return {
                    loc: ri,
                    ball: BallProp.of(randomColor())
                }
            });
    }
    
    function finishIteration(copy, i) {
        let allocateNextBalls = false;
        let ballsMatched = match(copy, [i], w, BallProp.isIdentical);
        if (ballsMatched.length === 0) {
            //
            // NO match-N+: Future balls will now pop up at their registered locations
            // This can also result in a match-N+
            //
            allocateNextBalls = true;
            const idxOfNextBallAtI = nextBalls.findIndex(next => next.loc === i);
            if (idxOfNextBallAtI >= 0) {
                nextBalls[idxOfNextBallAtI].loc = randomIndices(1, copy,
                    (arr, loc) => !arr[loc] && !nextBalls.find(next => next.loc === loc))
                    .pop();
            }
            nextBalls.forEach(next => copy[next.loc] = BallProp.of(next.ball.color));
            ballsMatched = match(copy, nextBalls.map(next => next.loc), w, BallProp.isIdentical);
        }
        if (ballsMatched.length > 0) {
            ballsMatched.forEach(ri => copy[ri] = null);
            increaseScore(ballsMatched.length);
        }
        setSquare(copy);
        if (allocateNextBalls) {
            setNextBalls(initNextBalls(copy));
        }
    }

    function ballMoved(from, to) {
        const copy = squares.slice();
        copy[to] = squares[from];
        copy[from] = null;
        finishIteration(copy, to);
    }

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
                    <RefreshIcon onClick={restart} />
                </div>
            </div>
            <div className="score-board">
                <span>Score: </span>
                <Score score={score} />
            </div>
            <Board w={w} h={h} squares={squares} nextBalls={nextBalls} onBallMoved={ballMoved} />
        </div>
    );
}