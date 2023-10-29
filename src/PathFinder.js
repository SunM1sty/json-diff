"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathFinder = void 0;
var fs = require("fs");
var path = require("path");
var PathFinder = /** @class */ (function () {
    function PathFinder() {
        this._fileRoutes = [];
        this._folderRoutes = [];
        this._fileRoutes = [];
        this._folderRoutes = [];
    }
    Object.defineProperty(PathFinder.prototype, "fileRoutes", {
        get: function () {
            return this._fileRoutes;
        },
        enumerable: false,
        configurable: true
    });
    PathFinder.prototype.pushToFileRoutes = function (paths) {
        this._fileRoutes = this._fileRoutes.concat(paths);
        return this;
    };
    Object.defineProperty(PathFinder.prototype, "folderRoutes", {
        get: function () {
            return this._folderRoutes;
        },
        enumerable: false,
        configurable: true
    });
    PathFinder.prototype.pushToFolderRoutes = function (paths) {
        this._folderRoutes = this._folderRoutes.concat(paths);
        return this;
    };
    PathFinder.prototype.isFilePathAlreadyIncludes = function (path) {
        return this.fileRoutes.includes(path);
    };
    PathFinder.prototype.parseRoutes = function (paths) {
        var jsonFilePaths = [];
        var folderPaths = [];
        paths.forEach(function (path) {
            if (path.endsWith('.json')) {
                jsonFilePaths.push(path);
            }
            else if (fs.statSync(path).isDirectory()) {
                folderPaths.push(path);
            }
        });
        if (jsonFilePaths.length) {
            this.pushToFileRoutes(jsonFilePaths);
        }
        if (folderPaths.length) {
            this.pushToFolderRoutes(folderPaths);
        }
        return this;
    };
    PathFinder.prototype.extractJsonFilesFromFolder = function () {
        var _this = this;
        var fileRoutes = [];
        this._folderRoutes.forEach(function (folder) {
            void fs.readdirSync(folder).filter(function (file) {
                if (file.endsWith('.json') && !_this.isFilePathAlreadyIncludes(path.join(folder, file))) {
                    fileRoutes.push(path.join(folder, file));
                }
            });
        });
        this.pushToFileRoutes(fileRoutes);
        return this;
    };
    return PathFinder;
}());
exports.PathFinder = PathFinder;
