import {ContainerPlugin, Events} from 'clappr'
import TimelineEvent from './TimelineEvent.js'

export default class TimelineEventsPlugin extends ContainerPlugin {

    // backwards compatibility
    static get default() {
        return TimelineEventsPlugin
    }

    get name() { return 'timeline-events-plugin' }

    constructor(core) {
        super(core)
        clearEvents()
        this._duration = null
        this._mediaControlContainerLoaded = false
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
        this._duration = this.core.mediaControl.container.getDuration() || null
        this._dispatchEventsForDuration(this._duration)
    }

    _dispatchEventsForDuration(duration) {
        return this._events
            .filter((event) => event.getTime() === duration)
            .map((event) => {
                this.dispatch(event.getName())
                return event
            })
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
        super()
        this._events = null
    }
}
