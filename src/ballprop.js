export default class BallProp {

    constructor(color) {
        this.color = color
    }

    static of(color) {
        return new BallProp(color);
    }

    static isIdentical(s1, s2) {
        if (s1 === null || s2 === null) return false;
        return s1.color === s2.color;
    }
}