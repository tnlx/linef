import { hasRoute } from './scanner.js';
import Square from './square.component';
import { Ball, BallMaybe } from './ball.component.jsx';
import { useState } from 'react';

export default function Board({ squares, nextBalls, w, h, onBallMoved }) {

    const [moveFrom, setMoveFrom] = useState(null);
    
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
        setMoveFrom(null);
        onBallMoved(from, to);
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
