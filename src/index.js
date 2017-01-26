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
        this._debug = false
        this._setDebugStatus()

        this.logger('Loading plugin')

        this.clearCommands()
        this._addInitialCommands()
    }

    _setDebugStatus() {
        const options = this._getOptions()
        this._debug = (options && options.debug) ? true : false
    }

    logger(message) {
        if (this._debug) {
            console.log(`[TimelinePlugin] ${message}`)
        }
    }

    bindEvents() {
        this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._onMediaControlContainerChanged)
    }

    _addInitialCommands() {
        this.logger(`Adding Initial Commands`)
        const options = this._getOptions()

        if (!options || !Array.isArray(options.list) || options.list.length === 0) {
            this.logger(`No commands to add`)
            return
        }

        this.logger(`Adding ${options.list.length}`)
        options.list.map((command) => {
            this.addCommand(command.elapsedTime, command.fn)
        })
    }

    _onMediaControlContainerChanged() {
        this._bindContainerEvents()
        this._mediaControlContainerLoaded = true
        this._updateTimer()
    }

    _bindContainerEvents() {
        if (this._oldContainer) {
            this.logger(`unbindingContainerEvents`)
            this.stopListening(this._oldContainer, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
            this.stopListening(this._oldContainer, Events.CONTAINER_SEEK, this._onSeekContainer)
        }
        this.logger(`bindingContainerEvents`)
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
        const currentTime = parseInt(this.core.mediaControl.container.getCurrentTime())

        this._executeCommandsForTime(currentTime)
    }

    _executeCommandsForTime(time) {
        return this._commands
            .filter((command) => command.getTime() === time && !command.isFired())
            .map((command) => command.fire())
    }

    _getOptions() {
        if (!("timelineCommandsPlugin" in this.core.options)) {
            return false
        }
        return this.core.options.timelineCommandsPlugin
    }

    /*
    * Command handling Methods
    */

    addCommand(time, command) {
        this.logger(`addCommand at ${time}`)
        this._commands.push(new TimelineCommand(time, command))
    }

    removeCommand(time, command) {
        this.logger(`removeCommand at ${time}`)
        this._commands = this._commands.filter((command) => {
            return command.getTime() !== time && command.getCommand() !== command
        })
    }

    clearCommands() {
        this.logger('clearCommands')
        this._commands = []
    }

    resetCommands() {
        this.logger('resetCommands')
        this._commands.map((command) => command.reset())
    }

    getCommands(start=false, end=false) {
        return this._commands
            .filter((command) => start === false ? true : (command.getTime() >= start))
            .filter((command) => end === false ? true : (command.getTime() <= end))
    }

    destroy() {
        this.logger('destroy')
        super.destroy()
        this._commands = null
    }

}
