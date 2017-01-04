import {CorePlugin, Events} from 'clappr'
import TimelineEvent from './TimelineEvent.js'

export default class TimelineEventsPlugin extends CorePlugin {
    // backwards compatibility
    static get default() {
        return TimelineEventsPlugin
    }

    get name() { return 'timeline-events-plugin' }

    constructor(core) {
        super(core)
        this._mediaControlContainerLoaded = false
        this.clearEvents()
    }

    bindEvents() {
        this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._onMediaControlContainerChanged)
    }

    _onMediaControlContainerChanged() {
        this._bindContainerEvents()
        this._mediaControlContainerLoaded = true
        this._updateDuration()
    }

    _bindContainerEvents() {
        if (this._oldContainer) {
            this.stopListening(this._oldContainer, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
        }
        this._oldContainer = this.core.mediaControl.container
        this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
    }

    _onTimeUpdate() {
        this._updateDuration()
    }

    _updateDuration() {
        this._dispatchEventsForTime(parseInt(this.core.mediaControl.container.getCurrentTime()))
    }

    _dispatchEventsForTime(time) {
        return this._events
            .filter((event) => event.getTime() === time && !event.isFired())
            .map(event => event.fire())
    }

    _getOptions() {
        if (!("timelineEventsPlugin" in this.core.options)) {
            throw "'timelineEventsPlugin' property missing from options object."
        }
        return this.core.options.timelineEventsPlugin
    }

    /*
    * Events
    */
    addEvent(time, eventName) {
        this._events.push(new TimelineEvent(time, eventName))
    }

    removeEvent(time, eventName) {
        this._events = this._events.filter((event) => { event.getTime() !== time && event.getName() !== eventName})
    }

    clearEvents() {
        this._events = []
    }

    getEvents(start=false, end=false) {
        this._events
            .filter((event) => start === false ? true : (event.getTime() >= start))
            .filter((event) => end === false ? true : (event.getTime() <= end))
            .map((event) => {
                this.dispatch(event.getName())
                return event
            })
    }

    destroy() {
        super.destroy()
        this._events = null
    }
}
