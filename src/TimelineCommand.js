
export default class TimelineCommand {
    constructor(time, fn) {
        this._fn = fn
        this._time = time
        this._isFired = false
    }

    getTime() {
        return this._time
    }

    getCommand() {
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
