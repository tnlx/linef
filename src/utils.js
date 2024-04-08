/**
 * Get random indices of an array with some filter conditions
 * @param {*} noOfSlots number of random indexes of input array to be generated
 * @param {*} sourceArray input array
 * @param {*} filterFunction filter condition for index of array
 * @returns []
 * 
 * @example 
 * randomIndices(1, [1, A, 4], idx => idx !== 4)
 * result: [1], or [2]
 */
export function randomIndices(noOfSlots, sourceArray, filterFunction) {
    let result = []

    // FS contains all indices of sourceArray which satisfy the filter condition
    let fs = sourceArray.reduce((acc, curr, index) => {
        if (curr === null && filterFunction(sourceArray, index)) {
            acc.push(index);
        }
        return acc;
    }, []);

    // Select *noOfSlots* random indices from FS
    for (let i = 0; i < noOfSlots && fs.length > 0; i++) {
        const fsIdx = Math.floor(Math.random() * fs.length)
        result.push(fs.splice(fsIdx, 1)[0])
    }
    return result
}