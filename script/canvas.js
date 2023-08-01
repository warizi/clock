class Dot {
    constructor(x, y, nth) {
        this.x = x;
        this.y = y;
        this.nth = nth || 0;
        this.distanceX = x;
        this.distanceY = y;
    }
    setDistance(x, y) {
        let totalDistanceX = x || 0;
        let totalDistanceY = 245 - y || 0;
        this.distanceY = 245 - (totalDistanceY / 5 * this.nth) || 0;
        this.distanceX = totalDistanceX / 5 * this.nth || 0;
        return this
    }
    locateDot(dom) {
        dom.style.transform = `translate(${this.distanceX}px, ${this.distanceY}px)`;
        return this
    }
}
export default Dot