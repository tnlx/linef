import React, { useState } from 'react';
import Scanner from './scanner';
import BallProp from './ballprop.js';
import { randomIndices } from './utils'
import { checkResolved } from './resolver'
import Square from './square.component.js';

export default function Board({ w, h, palette, matched }) {

    const noRandomF = 3;

    const [squares, setSquare] = useState(initArray());
    const [selected, setSelected] = useState(null);

    function randomColor() {
        return palette[Math.floor(Math.random() * palette.length)]
    }

    function initArray() {
        let arr = Array(w * h).fill(null)
        const noRandomP = 5;
        
        let fIdx = randomIndices(noRandomP + noRandomF, arr, () => true)
        for (let i = 0; i < noRandomP; i++){
            arr[fIdx.pop()] = BallProp.ofPresent(randomColor());
        }
        for (let i = 0; i < noRandomF; i++){
            arr[fIdx.pop()] = BallProp.ofFuture(randomColor());
        }
        return arr
    }

    function indexOfNextBalls() {
        var indexes = [], i;
        const sq = squares;
        for (i = 0; i < sq.length; i++) {
            if (sq[i] && sq[i].isFutureItem()) {
                indexes.push(i);
            }
        }
        return indexes;
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
        return neighbors.filter(v_idx => squareIsNotOccupied(squares, v_idx))
    }

    function squareIsNotOccupied(square, idx) {
        return !square[idx] || square[idx].isFree()
    }

    // CLICK-EVENT ===================================================================

    /**
     * Is there a clear path for item to move from
     * the square at fromIdx to the square toIdx?
     * @returns true/false
     */
    function movable(fromIdx, toIdx) {
        const scanner = new Scanner(fromIdx, toIdx, neighborsMovable)
        const findRoute = scanner.findRoute()
        return {
            found: findRoute.found,
            route: findRoute.route
        }
    }

    /**
     * Square at *i* was selected, waiting for a destination.
     */
    function updateState_moveFrom(i) {
        setSelected(i);
    }

    function squareIsEmpty(arr, idx) {
        return !arr[idx];
    }

    /**
     * The destination was selected at index *i*.
     * Refresh game states:
     * - Move the ball from source to destination
     * - Check for a macth-5+
     * - Prepare the next iteration
     */
    function updateState_moveItemTo(i) {

        const copy = squares.slice();

        // In case the destination point was registered by a future ball, store it here
        // before manipulating the grid
        const futureBallAtI = copy[i] && copy[i].isFutureItem()
            ? BallProp.copy(copy[i])
            : null;

        // move the selected ball to location <i>
        copy[i] = copy[selected]
        copy[selected] = null

        let ballsMatched = checkResolved(copy, [i], { w: w, h: h })
        if (ballsMatched.length === 0) {
            // The move resulted in no match.
            // Future balls will now pop up at their registered locations
            // This can result in a match-N+

            const futureBallLocs = indexOfNextBalls();
            let activeIndices = [...futureBallLocs];
            if (futureBallAtI) {
                // Find a new home for this future ball and render it as a concrete ball
                const nextFree = randomIndices(1, copy, squareIsEmpty).pop()
                copy[nextFree] = BallProp.ofPresent(futureBallAtI.color);
                activeIndices.push(nextFree);
            }

            // all future balls can now pop up
            futureBallLocs.forEach(idx => copy[idx] = BallProp.ofPresent(copy[idx].color));

            // Check match-5+ again
            checkResolved(copy, activeIndices, { w: w, h: h })
                .forEach(ri => copy[ri] = null);

            // Prepare the next set of future balls
            randomIndices(noRandomF, copy, squareIsEmpty)
                .forEach(rfs => copy[rfs] = BallProp.ofFuture(randomColor()));
        } else {
            // Some match-5+ found, hence no new ball pops up (future balls' state unchanged)
            // clear all cell involved in the match-5+ (except for the future ball if any)
            ballsMatched.forEach(ri => copy[ri] = null);
            if (futureBallAtI) {
                copy[i] = futureBallAtI
            }
        }

        // notify state changes
        setSquare(copy);
        setSelected(null);

        // Update score: send signal to parent component (Game)
        if (ballsMatched.length > 0) {
            matched(ballsMatched.length)
        }
    }

    function onSquareSelected(i) {
        if (squares[i] && squares[i].isPresentItem()) {
            updateState_moveFrom(i)
            return;
        }
        const moveFromIdx = selected;
        const moveToIdx = i;
        if (moveFromIdx != null && squares[moveFromIdx] /* valid source */
            && squareIsNotOccupied(moveToIdx) /* valid destination */
            && movable(moveFromIdx, moveToIdx).found) /* valid path */{
            updateState_moveItemTo(moveToIdx)
            return;
        }
        // Else: Blank square selected (?) => Ignore
    }

    // REACT-RENDER ===================================================================

    function renderCells() {
        return squares.map((v, i) => 
        <Square key={i}
            item={v}
            onClick={() => onSquareSelected(i)}
            activated={selected === i}/>
        );
    }

    return (
        <div className='game-board'>
            {renderCells()}
        </div>
    );
}
