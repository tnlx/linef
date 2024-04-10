import BallProp from './ballprop'

const isMatched = (e1, e2) => BallProp.isIdentical(e1, e2);

/**
 * Check for a match-N+
 * 
 * This function checks for elements surrounding the active indices
 * to see if a match-N+ is found (horizontal/vertical/diagonal)
 * 
 * @param {*} arr 1d-array represents a 2-dimension (*w x h*) grid of items
 * @param {*} activeIndices array of all indexes to be checked for a match
 * @param {*} dimen { w, h } *arr*'s dimensions
 * @returns array contains indexes of *arr* that involve in a match
 */
export function checkResolved(arr, activeIndices, { w, h }) {
    let resolved = []
    activeIndices.forEach(i => {
        resolved = resolved
            .concat(checkResolved_horizontal(arr, i, { w, h }))
            .concat(checkResolved_vertical(arr, i, { w, h }))
            .concat(checkResolved_diagonal(arr, i, { w, h }))
    })
    return resolved;
}


function checkResolved_horizontal(arr, i, { w, h }) {
    /* [ i % w == 0 ] [ i % w == 1 ] ... [ i % w == w-1 ] */
    const lineWrapStart = Math.floor(i / h) * w;
    const lineWrapEnd = lineWrapStart + w;
    return checkResolved_withOffset(arr, i, 1, {
        forward_bound: lineWrapEnd,
        backward_bound: lineWrapStart
    })
}

function checkResolved_vertical(arr, i, { w }) {
    /*
    * [ i - w]
    * [ i ]
    * [ i + w]
    */
    return checkResolved_withOffset(arr, i, w, {
        forward_bound: arr.length,
        backward_bound: 0
    })
}

function checkResolved_diagonal(arr, i, { w }) {
    const bounds = {
        forward_bound: arr.length,
        backward_bound: 0
    };

    return []
        /*
        * [ x ][   ][   ]
        * [   ][ x ][   ]
        * [   ][   ][ x ]
        */
        .concat(checkResolved_withOffset(arr, i, w + 1, bounds))
        /*
        * [   ][   ][ x ]
        * [   ][ x ][   ]
        * [ x ][   ][   ]
        */
        .concat(checkResolved_withOffset(arr, i, w - 1, bounds));
}

function checkResolved_withOffset(arr, i, offset, { forward_bound, backward_bound }) {
    let countForward = []
    for (let incr = i + offset; incr < forward_bound
        && isMatched(arr[incr], arr[i]); incr += offset) {
        countForward.push(incr)
    }

    let countBackward = []
    for (let decr = i - offset; decr >= backward_bound
        && isMatched(arr[decr], arr[i]); decr -= offset) {
        countBackward.push(decr)
    }

    const count = countBackward.length + countForward.length + 1
    if (count >= 5) {
        return [i].concat(countForward, countBackward);
    }
    return [];
}