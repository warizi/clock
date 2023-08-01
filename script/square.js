class Square {
    constructor(dom) {
        this.dom = dom;
        this.dotAX = 0;
        this.dotAY = 0;
        this.dotBX = 0;
        this.dotBY = 0;
        this.x = 0;
        this.y = 0;
        this.deg = 0;
    }
    setPosition(dotAX, dotAY, dotBX, dotBY) {
        this.dotAX = dotAX || 0;
        this.dotAY = dotAY || 0;
        this.dotBX = dotBX || 0;
        this.dotBY = dotBY || 0;

        // 각도 계산 (라디안 단위)
        const angleRadians = Math.atan2(this.dotBY - this.dotAY, this.dotBX - this.dotAX);

        // 각도를 도 단위로 변환
        const angleDegrees = (angleRadians * 180) / Math.PI;
        const calcWidth = () => {
            return Math.sqrt((dotBX - dotAX) * (dotBX - dotAX) + (dotBY - dotAY) * (dotBY - dotAY));
        }
        this.dom.style.width = `${calcWidth()}px`;
        this.dom.style.transform = `translate(${(dotAX + dotBX)/2 - calcWidth()/2 + 5}px, ${(dotBY + dotAY)/2}px) rotate(${angleDegrees}deg)`;
    }
}
export default Square