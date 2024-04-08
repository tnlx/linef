import React, { useState } from 'react';
import Scanner from './scanner';
import BallProp from './ballprop.js';
import { randomIndices } from './utils'
import { checkResolved } from './resolver'
import Square from './square.component.js';

export default function Board({ w, h, score_incr }) {

    const noRandomF = 3;
    const colors = [
        'hsl(0,54%,60%)',
        'hsl(50,54%,60%)',
        'hsl(100,54%,60%)',
        'hsl(150,54%,60%)',
        'hsl(200,54%,60%)',
        'hsl(250,54%,60%)',
        'hsl(300,54%,60%)',
    ]

    const [squares, setSquare] = useState(initArray());
    const [selected, setSelected] = useState(null);

    function randomColor() {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    function initArray() {
        let arr = Array(w * h).fill(null)
        const noRandomP = 5;

        let fIdx = randomIndices(noRandomP + noRandomF, arr, () => true)

        for (let i = 0; i < noRandomP; i++) arr[fIdx.pop()] = BallProp.ofPresent(randomColor());
        for (let i = 0; i < noRandomF; i++) arr[fIdx.pop()] = BallProp.ofFuture(randomColor());

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

    function lineWrapOfIndex(idx) {
        const st = Math.floor(idx / h) * w
        return {
            start: st,
            end: st + w
        }
    }

    /**
     * function to retrieve neighbor squares that the ball currently located at square idx can move to
     * @param {*} idx
     * @returns 
     */
    function validNeighborIndex(idx) {
        const check_idx_u = idx - w
        const check_idx_l = idx - 1
        const check_idx_r = idx + 1
        const check_idx_d = idx + w

        // Check for boundaries:
        let valid_check_idx = []
        const line_wrap = lineWrapOfIndex(idx)

        if (check_idx_u >= 0) valid_check_idx.push(check_idx_u)
        if (check_idx_l >= line_wrap.start) valid_check_idx.push(check_idx_l)
        if (check_idx_r < line_wrap.end) valid_check_idx.push(check_idx_r)
        if (check_idx_d < w * h) valid_check_idx.push(check_idx_d)

        return valid_check_idx.filter(v_idx => isSquareFree(squares, v_idx))
    }

    function isSquareFree(square, idx) {
        return square[idx] === null || square[idx].isFree()
    }

    // CLICK-EVENT ===================================================================

    /**
     * check if there's a clear path for item to move from
     * one square to another
     * @param {*} from_idx current position index
     * @param {*} to_idx destination index
     * @returns true if a path is found; false otherwise
     */
    function movable(from_idx, to_idx) {
        /*
         * at regular location, item can move to 4 neighbor squares
         * i: index of item
         * X: where i can move to, if its index is valid
         * 
         * also, i-1 and i+1 should be within line boundaries as item at beginning of one row
         * should not be able to move to the end of the previous row
         * 
         * [   ] [i-w] [   ]
         * [i-1] [<i>] [i+1]
         * [   ] [i+w] [   ]
         * 
         */
        const scanner = new Scanner(from_idx, to_idx, validNeighborIndex)
        const findRoute = scanner.findRoute()

        return {
            found: findRoute.found,
            route: findRoute.route
        }
    }

    /**
     * signal that an item is selected by user click, and may be moved
     * to another position at next click event
     * @param {*} i 
     */
    function updateState_moveFrom(i) {
        setSelected(i);
    }

    function emptyCell(arr, idx) {
        return !arr[idx];
    }

    /**
     * logic to update game state when moving an item at square *selected*
     * to square *i* which is already confirmed to be a blank square
     * @param {*} i index of destination square
     */
    function updateState_moveItemTo(i) {

        const copy = squares.slice();

        // In case the destination point was registered for a new ball to pop up, store it here
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
                const nextFree = randomIndices(1, copy, emptyCell).pop()
                copy[nextFree] = BallProp.ofPresent(futureBallAtI.color);
                activeIndices.push(nextFree);
            }

            // all future balls can now pop up
            futureBallLocs.forEach(idx => copy[idx] = BallProp.ofPresent(copy[idx].color));

            // Prepare the next set of future balls
            randomIndices(noRandomF, copy, emptyCell)
                .forEach(rfs => copy[rfs] = BallProp.ofFuture(randomColor()));

            // Check match-5+ again
            checkResolved(copy, activeIndices, { w: w, h: h })
                .forEach(ri => copy[ri] = null);
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
            score_incr(ballsMatched.length)
        }
    }

    /**
     * calculation logic and possible state changes when a click event is performed on a square
     * @param {*} i index of selected square in *squares* array
     * @returns 
     */
    
    function onSquareSelected(i) {
        if (squares[i] && squares[i].isPresentItem()) {
            updateState_moveFrom(i)
            return;
        }

        if (selected != null /* A destination to move selected item to has been selected */
            && movable(selected, i).found /* and a valid path is confirmed */) {
            updateState_moveItemTo(i)
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
            isActivated={selected === i} />
        );
    }

    return (
        <div className='game-board'>
            {renderCells()}
        </div>
    );
}
