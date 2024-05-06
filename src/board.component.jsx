import { useState } from 'react';
import { hasRoute } from './scanner.js';
import BallProp from './ballprop.js';
import { randomIndices } from './utils.js'
import { match } from './matcher.js'
import Square from './square.component';
import { Ball, BallMaybe } from './ball.component.jsx';

export default function Board({ w, h, palette, matched }) {

    const noRandomF = 3;
    const noRandomP = 5; // at initialization
    const [squares, setSquare] = useState(initArray());
    const [nextBalls, setNextBalls] = useState(initNextBalls(squares));
    const [moveFrom, setMoveFrom] = useState(null);

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

    function rowBounds(idx) {
        const st = Math.floor(idx / h) * w
        return {
            start: st,
            end: st + w
        }
    }

    /**
     * All neighbor slots that the ball can move to in one step
     * @param {*} idx 
     * @returns 
     */
    function neighborsMovable(idx) {
        const t = idx - w;
        const l = idx - 1;
        const r = idx + 1;
        const b = idx + w;
        const rb = rowBounds(idx);

        let neighbors = []
        if (t >= 0) {
            neighbors.push(t);
        }
        if (l >= rb.start) {
            neighbors.push(l);
        }
        if (r <= rb.end) {
            neighbors.push(r);
        }
        if (b < w * h) {
            neighbors.push(b);
        }
        return neighbors.filter(v_idx => v_idx < squares.length && squareIsNotOccupied(squares, v_idx))
    }

    function squareIsNotOccupied(square, idx) {
        return !square[idx];
    }

    // CLICK-EVENT ===================================================================

    /**
     * Is there a clear path for item to move from
     * the square at fromIdx to the square toIdx?
     * @returns true/false
     */
    function movable(fromIdx, toIdx) {
        return !!hasRoute(fromIdx, toIdx, neighborsMovable);
    }

    function move(from, to) {
        const copy = squares.slice();
        copy[to] = copy[from];
        copy[from] = null;
        finishIteration(copy, to);
    }

    /**
     * A move happened. Refresh game states:
     * - Check for a match-N+
     * - Prepare the next iteration
     * @param {*} copy of the squares array that contains changes resulted from the move
     * @param {*} i the Move-To location
     */
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
            matched(ballsMatched.length);
        }
        setSquare(copy);
        setMoveFrom(null);
        if (allocateNextBalls) {
            setNextBalls(initNextBalls(copy));
        }
    }

    function onSquareSelected(i) {
        if (squares[i]) {
            setMoveFrom(i);
            return;
        }
        const moveTo = i;
        if (moveFrom != null && squares[moveFrom] /* valid source */
            && squareIsNotOccupied(moveTo) /* valid destination */
            && movable(moveFrom, moveTo)) /* valid path */ {
            move(moveFrom, moveTo);
        }
        // Else: Blank square selected (?) => Ignore
    }

    // REACT-RENDER ===================================================================

    function renderCells() {
        return squares.map((v, i) => {
            let item = null;
            if (v) {
                item = <Ball color={v.color} />;
            } else {
                const nb = nextBalls.find(n => n.loc === i)?.ball;
                if (nb) {
                    item = <BallMaybe color={nb.color} />;
                }
            }
            return (
                <Square key={i}
                    item={item}
                    onClick={() => onSquareSelected(i)}
                    activated={moveFrom === i} />
            )
        });
    }

    return (
        <div className='game-board'>
            {renderCells()}
        </div>
    );
}
