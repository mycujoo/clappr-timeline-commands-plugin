import {CorePlugin, Events} from 'clappr'
import TimelineCommand from './TimelineCommand.js'

export default class TimelineEventsPlugin extends CorePlugin {
    // backwards compatibility
    static get default() {
        return TimelineEventsPlugin
    }

    get name() { return 'timeline-events-plugin' }

    constructor(core) {
        super(core)
        this._mediaControlContainerLoaded = false
        this.clearCommands()
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
        return this._commands
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
    addCommand(time, command) {
        this._commands.push(new TimelineCommand(time, command))
    }

    removeCommand(time, command) {
        this._commands = this._commands.filter((command) => { command.getTime() !== time && command.getCommand() !== command})
    }

    clearCommands() {
        this._commands = []
    }

    getEvents(start=false, end=false) {
        return this._commands
            .filter((command) => start === false ? true : (command.getTime() >= start))
            .filter((command) => end === false ? true : (command.getTime() <= end))
    }

    destroy() {
        super.destroy()
        this._commands = null
    }
}
