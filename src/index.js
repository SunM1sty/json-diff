"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDifference = void 0;
var fs = require("fs");
var PathFinder_1 = require("./PathFinder");
var LoggerService_1 = require("./LoggerService");
var JsonDifference = /** @class */ (function () {
    function JsonDifference(paths) {
        this._fileRoutes = [];
        this._jsonArray = [];
        this._keyCounter = {};
        this._jSONWithMissingKeysArray = [];
        this._pathFinder = new PathFinder_1.PathFinder();
        this._logger = new LoggerService_1.LoggerService();
        this._jsonArray = [];
        this._fileRoutes = this._pathFinder.parseRoutes(paths).extractJsonFilesFromFolder().fileRoutes;
        this._logger.logInfo("Instance of JsonDifference was invoked with following file routes:\n".concat(this.fileRoutes.join('\n')));
    }
    Object.defineProperty(JsonDifference.prototype, "fileRoutes", {
        get: function () {
            return this._fileRoutes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JsonDifference.prototype, "keyCounter", {
        get: function () {
            return this._keyCounter;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JsonDifference.prototype, "jsonArray", {
        get: function () {
            return this._jsonArray;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JsonDifference.prototype, "jsonWithMissingKeysArray", {
        get: function () {
            console.log(this._jSONWithMissingKeysArray);
            return this._jSONWithMissingKeysArray;
        },
        enumerable: false,
        configurable: true
    });
    JsonDifference.prototype.pushToJsonArray = function (json) {
        this._jsonArray.push(json);
        return this;
    };
    JsonDifference.prototype.pushToJsonWithMissingKeysArray = function (json) {
        this._jSONWithMissingKeysArray.push(json);
        return this;
    };
    JsonDifference.prototype.copyJsonData = function () {
        var _this = this;
        this.fileRoutes.forEach(function (route) {
            var jsonString = fs.readFileSync(route, 'utf8');
            try {
                var json = JSON.parse(jsonString);
                _this.pushToJsonArray({ path: route, json: json });
            }
            catch (error) {
                _this._logger.logError("Error occurred while pasring json: ".concat(route));
                throw new Error("Error occurred while pasring json: ".concat(route));
            }
        });
        return this;
    };
    JsonDifference.prototype.encountKeys = function () {
        var _this = this;
        this.jsonArray.forEach(function (jsonWithPath) {
            for (var key in jsonWithPath.json) {
                if (!_this._keyCounter[key]) {
                    _this._keyCounter[key] = [jsonWithPath.path];
                }
                else {
                    _this._keyCounter[key] = __spreadArray(__spreadArray([], _this._keyCounter[key], true), [jsonWithPath.path], false);
                }
            }
        });
        return this;
    };
    JsonDifference.prototype.findMissingKeys = function () {
        var _this = this;
        this.jsonArray.forEach(function (jsonWithPath) {
            var jsonWithMissingKeys = {
                path: jsonWithPath.path,
                missingKeys: []
            };
            for (var key in _this.keyCounter) {
                if (!jsonWithPath.json[key]) {
                    jsonWithMissingKeys.missingKeys.push(key);
                }
            }
            if (jsonWithMissingKeys.missingKeys.length) {
                _this.pushToJsonWithMissingKeysArray(jsonWithMissingKeys);
            }
        });
        return this;
    };
    return JsonDifference;
}());
exports.JsonDifference = JsonDifference;
var paths = [
    'mock-data',
    'mock-data\\json',
    'mock-data\\fifth.json'
];
new JsonDifference(paths).copyJsonData().encountKeys().findMissingKeys().jsonWithMissingKeysArray;
