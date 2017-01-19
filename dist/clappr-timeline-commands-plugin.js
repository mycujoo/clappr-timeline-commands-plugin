(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["clappr"], factory);
	else if(typeof exports === 'object')
		exports["ClapprTimelineCommandsPlugin"] = factory(require("clappr"));
	else
		root["ClapprTimelineCommandsPlugin"] = factory(root["clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _clappr=__webpack_require__(2);var _TimelineCommand=__webpack_require__(1);var _TimelineCommand2=_interopRequireDefault(_TimelineCommand);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var TimelineCommandsPlugin=function(_CorePlugin){_inherits(TimelineCommandsPlugin,_CorePlugin);_createClass(TimelineCommandsPlugin,[{key:'name',get:function get(){return'timeline-commands-plugin';}}],[{key:'default',// backwards compatibility
	get:function get(){return TimelineCommandsPlugin;}}]);function TimelineCommandsPlugin(core){_classCallCheck(this,TimelineCommandsPlugin);var _this=_possibleConstructorReturn(this,(TimelineCommandsPlugin.__proto__||Object.getPrototypeOf(TimelineCommandsPlugin)).call(this,core));_this._mediaControlContainerLoaded=false;_this.clearCommands();return _this;}_createClass(TimelineCommandsPlugin,[{key:'bindEvents',value:function bindEvents(){this.listenTo(this.core.mediaControl,_clappr.Events.MEDIACONTROL_CONTAINERCHANGED,this._onMediaControlContainerChanged);}},{key:'_onMediaControlContainerChanged',value:function _onMediaControlContainerChanged(){this._bindContainerEvents();this._mediaControlContainerLoaded=true;this._updateTimer();}},{key:'_bindContainerEvents',value:function _bindContainerEvents(){if(this._oldContainer){this.stopListening(this._oldContainer,_clappr.Events.CONTAINER_TIMEUPDATE,this._onTimeUpdate);this.stopListening(this._oldContainer,_clappr.Events.CONTAINER_SEEK,this._onSeekContainer);}this._oldContainer=this.core.mediaControl.container;this.listenTo(this.core.mediaControl.container,_clappr.Events.CONTAINER_TIMEUPDATE,this._onTimeUpdate);this.listenTo(this.core.mediaControl.container,_clappr.Events.CONTAINER_SEEK,this._onSeekContainer);}},{key:'_onSeekContainer',value:function _onSeekContainer(){this.resetCommands();}},{key:'_onTimeUpdate',value:function _onTimeUpdate(){this._updateTimer();}},{key:'_updateTimer',value:function _updateTimer(){this._executeCommandsForTime(parseInt(this.core.mediaControl.container.getCurrentTime()));}},{key:'_executeCommandsForTime',value:function _executeCommandsForTime(time){return this._commands.filter(function(command){return command.getTime()===time&&!command.isFired();}).map(function(command){return command.fire();});}},{key:'_getOptions',value:function _getOptions(){if(!("timelineCommandsPlugin"in this.core.options)){throw"'timelineCommandsPlugin' property missing from options object.";}return this.core.options.timelineCommandsPlugin;}/*
	    * Events
	    */},{key:'addCommand',value:function addCommand(time,command){this._commands.push(new _TimelineCommand2.default(time,command));}},{key:'removeCommand',value:function removeCommand(time,command){this._commands=this._commands.filter(function(command){return command.getTime()!==time&&command.getCommand()!==command;});}},{key:'clearCommands',value:function clearCommands(){this._commands=[];}},{key:'resetCommands',value:function resetCommands(){this._commands.map(function(command){return command.reset();});}},{key:'getCommands',value:function getCommands(){var start=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;var end=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;return this._commands.filter(function(command){return start===false?true:command.getTime()>=start;}).filter(function(command){return end===false?true:command.getTime()<=end;});}},{key:'destroy',value:function destroy(){_get(TimelineCommandsPlugin.prototype.__proto__||Object.getPrototypeOf(TimelineCommandsPlugin.prototype),'destroy',this).call(this);this._commands=null;}}]);return TimelineCommandsPlugin;}(_clappr.CorePlugin);exports.default=TimelineCommandsPlugin;module.exports=exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var TimelineCommand=function(){function TimelineCommand(time,fn){_classCallCheck(this,TimelineCommand);this._fn=fn;this._time=time;this._isFired=false;}_createClass(TimelineCommand,[{key:"getTime",value:function getTime(){return this._time;}},{key:"getCommand",value:function getCommand(){return this._fn;}},{key:"isFired",value:function isFired(){return this._isFired;}},{key:"fire",value:function fire(){this._isFired=true;this._fn();return this;}},{key:"reset",value:function reset(){this._isFired=false;}}]);return TimelineCommand;}();exports.default=TimelineCommand;module.exports=exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;
