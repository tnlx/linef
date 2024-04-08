export default class BallProp {

    constructor(type, color) {
        this.type = type
        this.color = color
    }

    static ofPresent(color) {
        return new BallProp('p', color);
    }

    static ofFuture(color) {
        return new BallProp('f', color);
    }

    /**
     * Create a new BallProp by copying all properties of the input item
     * @param {*} ballprop 
     * @returns 
     */
    static copy(ballprop) {
        return ballprop ? new BallProp(ballprop.type, ballprop.color) : null
    }

    /**
     * Check if two items is identical
     * @param {*} s1 
     * @param {*} s2 
     * @returns 
     */
    static isIdentical(s1, s2) {
        if (s1 === null || s2 === null) return false
        return s1.type === s2.type && s1.color === s2.color
    }

    isPresentItem() {
        return this.type === 'p'
    }

    isFutureItem() {
        return this.type === 'f'
    }

    isFree() {
        return this.type !== 'p'
    }
}