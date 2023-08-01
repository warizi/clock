
class AlarmStorage {
    constructor() {
        this.alarmData = [];
        this.alarmId = [];
    }
    getList() {
        this.alarmData = JSON.parse(window.localStorage.getItem('alarm')) || [];
        return this.alarmData;
    }
    deleteList(id) {
        this.alarmData = JSON.parse(window.localStorage.getItem('alarm')) || [];
        this.alarmData = this.alarmData.filter((item) => {
            return Number(item.id) !== Number(id)
        });
        window.localStorage.setItem('alarm', JSON.stringify(this.alarmData));
    }
    addList(listData) {
        this.alarmId = JSON.parse(window.localStorage.getItem('alarmId')) || [];
        const id = this.alarmId.length + 1;
        this.alarmId.push(id);
        window.localStorage.setItem('alarmId', JSON.stringify(this.alarmId));
        this.alarmData = JSON.parse(window.localStorage.getItem('alarm')) || [];
        this.alarmData.push(listData);
        window.localStorage.setItem('alarm', JSON.stringify(this.alarmData));
    }
    getId() {
        const idList = JSON.parse(window.localStorage.getItem('alarmId')) || [];
        const id = idList.length + 1;
        return id
    }
}
export default AlarmStorage