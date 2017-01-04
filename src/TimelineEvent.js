
export default class TimelineEvent {
    constructor(time, eventName) {
        this._eventName = eventName
        this._time = time
    }

    getTime() {
        return this._time || -1
    }

    getName() {
        return this._eventName
    }
}
