import {CorePlugin, Events} from 'clappr'
import TimelineCommand from './TimelineCommand.js'

export default class TimelineCommandsPlugin extends CorePlugin {
    // backwards compatibility
    static get default() {
        return TimelineCommandsPlugin
    }

    get name() { return 'timeline-commands-plugin' }

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
        this._updateTimer()
    }

    _bindContainerEvents() {
        if (this._oldContainer) {
            this.stopListening(this._oldContainer, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
            this.stopListening(this._oldContainer, Events.CONTAINER_SEEK, this._onSeekContainer)
        }
        this._oldContainer = this.core.mediaControl.container
        this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
        this.listenTo(this.core.mediaControl.container, Events.CONTAINER_SEEK, this._onSeekContainer)
    }

    _onSeekContainer() {
        this.resetCommands()
    }

    _onTimeUpdate() {
        this._updateTimer()
    }

    _updateTimer() {
        this._executeCommandsForTime(parseInt(this.core.mediaControl.container.getCurrentTime()))
    }

    _executeCommandsForTime(time) {
        return this._commands
            .filter((command) => command.getTime() === time && !command.isFired())
            .map(command => command.fire())
    }

    _getOptions() {
        if (!("timelineCommandsPlugin" in this.core.options)) {
            throw "'timelineCommandsPlugin' property missing from options object."
        }
        return this.core.options.timelineCommandsPlugin
    }

    /*
    * Events
    */
    addCommand(time, command) {
        this._commands.push(new TimelineCommand(time, command))
    }

    removeCommand(time, command) {
        this._commands = this._commands.filter((command) => {
            return command.getTime() !== time && command.getCommand() !== command
        })
    }

    clearCommands() {
        this._commands = []
    }

    resetCommands() {
        this._commands.map((command) => command.reset())
    }

    getCommands(start=false, end=false) {
        return this._commands
            .filter((command) => start === false ? true : (command.getTime() >= start))
            .filter((command) => end === false ? true : (command.getTime() <= end))
    }

    destroy() {
        super.destroy()
        this._commands = null
    }
}
