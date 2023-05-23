'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.rowsAffectedCounter =
    exports.isBuffer =
    exports.isInteger =
    exports.isDate =
    exports.isString =
        void 0;
const isString = (stringFromRequest) => {
    return typeof stringFromRequest === 'string';
};
exports.isString = isString;
const isDate = (dateFromRequest) => {
    return Boolean(Date.parse(dateFromRequest));
};
exports.isDate = isDate;
const isInteger = (numberFromRequest) => {
    return Boolean(Number.parseInt(numberFromRequest));
};
exports.isInteger = isInteger;
const isBuffer = (bufferFromRequest) => {
    return Buffer.isBuffer(bufferFromRequest);
};
exports.isBuffer = isBuffer;
const rowsAffectedCounter = () => {
    let rowsAffected = 0;
    return () => {
        rowsAffected += 1;
        return rowsAffected;
    };
};
exports.rowsAffectedCounter = rowsAffectedCounter;
