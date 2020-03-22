export function limitNumberInRange(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}

export function getPercent(val: number, min: number, max: number): number {
    return ((val - min) / (max - min)) * 100;
}


/**
 * 取[min, max]之间的一个随机数
 * @param range 
 */
export function getRandomInt(range: [number, number]): number {
    console.log(Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]));
    return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
}