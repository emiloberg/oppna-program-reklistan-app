var definition = require("ui/gestures");
(function (GestureTypes) {
    GestureTypes[GestureTypes["tap"] = 1] = "tap";
    GestureTypes[GestureTypes["doubleTap"] = 2] = "doubleTap";
    GestureTypes[GestureTypes["pinch"] = 4] = "pinch";
    GestureTypes[GestureTypes["pan"] = 8] = "pan";
    GestureTypes[GestureTypes["swipe"] = 16] = "swipe";
    GestureTypes[GestureTypes["rotation"] = 32] = "rotation";
    GestureTypes[GestureTypes["longPress"] = 64] = "longPress";
})(exports.GestureTypes || (exports.GestureTypes = {}));
var GestureTypes = exports.GestureTypes;
(function (GestureStateTypes) {
    GestureStateTypes[GestureStateTypes["possible"] = 1] = "possible";
    GestureStateTypes[GestureStateTypes["recognized"] = 2] = "recognized";
    GestureStateTypes[GestureStateTypes["failed"] = 4] = "failed";
    GestureStateTypes[GestureStateTypes["cancelled"] = 8] = "cancelled";
    GestureStateTypes[GestureStateTypes["began"] = 16] = "began";
    GestureStateTypes[GestureStateTypes["changed"] = 32] = "changed";
    GestureStateTypes[GestureStateTypes["ended"] = 64] = "ended";
})(exports.GestureStateTypes || (exports.GestureStateTypes = {}));
var GestureStateTypes = exports.GestureStateTypes;
(function (SwipeDirection) {
    SwipeDirection[SwipeDirection["right"] = 1] = "right";
    SwipeDirection[SwipeDirection["left"] = 2] = "left";
    SwipeDirection[SwipeDirection["up"] = 4] = "up";
    SwipeDirection[SwipeDirection["down"] = 8] = "down";
})(exports.SwipeDirection || (exports.SwipeDirection = {}));
var SwipeDirection = exports.SwipeDirection;
function observe(target, type, callback, thisArg) {
    var observer = new definition.GesturesObserver(callback);
    observer.observe(target, type, thisArg);
    return observer;
}
exports.observe = observe;
function toString(type, separator) {
    var types = new Array();
    if (type & definition.GestureTypes.tap) {
        types.push("tap");
    }
    if (type & definition.GestureTypes.doubleTap) {
        types.push("doubleTap");
    }
    if (type & definition.GestureTypes.pinch) {
        types.push("pinch");
    }
    if (type & definition.GestureTypes.pan) {
        types.push("pan");
    }
    if (type & definition.GestureTypes.swipe) {
        types.push("swipe");
    }
    if (type & definition.GestureTypes.rotation) {
        types.push("rotation");
    }
    if (type & definition.GestureTypes.longPress) {
        types.push("longPress");
    }
    return types.join(separator);
}
exports.toString = toString;
function fromString(type) {
    var t = type.trim().toLowerCase();
    if (t === "tap") {
        return definition.GestureTypes.tap;
    }
    else if (t === "doubletap") {
        return definition.GestureTypes.doubleTap;
    }
    else if (t === "pinch") {
        return definition.GestureTypes.pinch;
    }
    else if (t === "pan") {
        return definition.GestureTypes.pan;
    }
    else if (t === "swipe") {
        return definition.GestureTypes.swipe;
    }
    else if (t === "rotation") {
        return definition.GestureTypes.rotation;
    }
    else if (t === "longpress") {
        return definition.GestureTypes.longPress;
    }
    return undefined;
}
exports.fromString = fromString;
