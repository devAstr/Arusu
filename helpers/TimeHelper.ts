export default class TimeHelper {
    static ConvertToTimeString(time: number): string {
        let t = new Date(time);
        let apm = t.getHours() < 12 ? '上午' : '下午';
        let h = `0${t.getHours()}`.slice(-2);
        let m = `0${t.getMinutes()}`.slice(-2);
        return `@ ${apm} ${h}:${m}`;
    }
}