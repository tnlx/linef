/**
 * Check for a match-N+
 * 
 * This function checks for elements surrounding the active indices array 'arr'
 * to see if a match-N+ is found (horizontal, vertical, diagonal)
 * 
 * @param {any[]} arr 1d-array represents a 2-dimension (w x h) grid of items
 * @param {number[]} activeIndices array of all indices to be checked for a match
 * @param {number} w the width of the grid represented by arr
 * @returns {[]} all indices of 'arr' that involve in a match
 */
export function match(arr, activeIndices, w , matchFunc) {

    return activeIndices.flatMap(i => [
        ...horizontal(i),
        ...vertical(i),
        ...diagonal1(i),
        ...diagonal2(i),
    ]);

    function horizontal(i) {
        return scan(i, 1);
    }

    function vertical(i) {
        return scan(i, w);
    }

    function diagonal1(i) {
        return scan(i, w + 1);
    }

    function diagonal2(i) {
        return scan(i, -w + 1);
    }
    
    function scan(i, offset) {
        let r = [i];
        let j = i - offset;
        const iPosInRow = i%w;
        while (j >= 0 && j < arr.length && j%w <= iPosInRow && matchFunc(arr[j], arr[j + offset])) {
            r.push(j);
            j -= offset;
        }
        j = i + offset;
        while (j >= 0 && j < arr.length && j%w >= iPosInRow && matchFunc(arr[j], arr[j - offset])) {
            r.push(j);
            j += offset;
        }
        return r.length >= 5 ? r : [];
    }
}
