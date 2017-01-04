
export default class TimelineEvent {
    constructor(time, fn) {
        this._fn = fn
        this._time = time
        this._isFired = false
    }

    getTime() {
        return this._time
    }

    getName() {
        return this._fn
    }

    isFired() {
        return this._isFired
    }

    fire() {
        this._isFired = true
        this._fn()
        return this
    }

    reset() {
        this._isFired = false
    }
}
