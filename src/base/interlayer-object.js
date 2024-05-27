"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.FieldError = exports.InterLayerObject = void 0;
var InterLayerObject = /** @class */ (function () {
    function InterLayerObject(statusCode, error, data) {
        this.statusCode = statusCode;
        this.error = error instanceof FieldError ? [error] : error;
        this.data = data;
    }
    return InterLayerObject;
}());
exports.InterLayerObject = InterLayerObject;
var FieldError = /** @class */ (function () {
    function FieldError(field, message) {
        this.field = field;
        this.message = message;
    }
    return FieldError;
}());
exports.FieldError = FieldError;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Success"] = 0] = "Success";
    StatusCode[StatusCode["Created"] = 1] = "Created";
    StatusCode[StatusCode["NoContent"] = 2] = "NoContent";
    StatusCode[StatusCode["Unauthorized"] = 3] = "Unauthorized";
    StatusCode[StatusCode["Forbidden"] = 4] = "Forbidden";
    StatusCode[StatusCode["BadRequest"] = 5] = "BadRequest";
    StatusCode[StatusCode["NotFound"] = 6] = "NotFound";
    StatusCode[StatusCode["ServerError"] = 7] = "ServerError";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
