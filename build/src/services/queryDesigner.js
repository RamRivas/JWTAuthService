'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.prepareUpdateQuery =
    exports.updateCallback =
    exports.prepareSelectQuery =
    exports.joinFiltersCallback =
    exports.joinsCallback =
    exports.columnsCallback =
    exports.filtersCallback =
        void 0;
const filtersCallback = (filters, index, paramIndex = undefined) => {
    const { key, operator, logicOperator } = filters[index];
    return index + 1 === filters.length
        ? `"${key}"${operator}$${!paramIndex ? index + 1 : paramIndex}`
        : `"${key}"${operator}$${
              !paramIndex ? index + 1 : paramIndex
          } ${logicOperator} ${(0, exports.filtersCallback)(
              filters,
              index + 1,
              !paramIndex ? undefined : paramIndex + 1
          )}`;
};
exports.filtersCallback = filtersCallback;
const columnsCallback = (columns, index, tableName) => {
    return index + 1 === columns.length
        ? `"${tableName}"."${columns[index]}"`
        : `"${tableName}"."${columns[index]}", ${(0, exports.columnsCallback)(
              columns,
              index + 1,
              tableName
          )}`;
};
exports.columnsCallback = columnsCallback;
const joinsCallback = (joins, index) => {
    const { joinType, tableName, filters } = joins[index];
    return index + 1 === joins.length
        ? `${joinType} JOIN "${tableName}" ON ${(0,
          exports.joinFiltersCallback)(filters, 0)} ${(0,
          exports.joinsCallback)(joins, index + 1)}`
        : `${joinType} JOIN "${tableName}" ON ${(0,
          exports.joinFiltersCallback)(filters, 0)} `;
};
exports.joinsCallback = joinsCallback;
const joinFiltersCallback = (filters, index) => {
    const { key, value, operator, logicOperator } = filters[index];
    return index + 1 === filters.length
        ? `"${key}"${operator}${value}`
        : `"${key}"${operator}${value} ${logicOperator} ${(0,
          exports.joinFiltersCallback)(filters, index + 1)}`;
};
exports.joinFiltersCallback = joinFiltersCallback;
const prepareSelectQuery = (
    tableName,
    name,
    columns,
    filters,
    joins = undefined
) => {
    const text = `SELECT ${
        columns
            ? (0, exports.columnsCallback)(columns, 0, tableName)
            : `"${tableName}".*`
    } FROM "${tableName}" ${
        joins ? (0, exports.joinsCallback)(joins, 0) : ''
    } ${filters ? `WHERE ${(0, exports.filtersCallback)(filters, 0)}` : ''}`;
    const values = [];
    if (filters) {
        for (const element of filters) {
            values.push(element.value);
        }
    }
    const preparedQuery = {
        name,
        text,
        values,
    };
    return preparedQuery;
};
exports.prepareSelectQuery = prepareSelectQuery;
const updateCallback = (updateValues, index) => {
    const { key } = updateValues[index];
    return index + 1 === updateValues.length
        ? `"${key}"=$${index + 1}`
        : `${key}=$${index + 1}, ${(0, exports.updateCallback)(
              updateValues,
              index + 1
          )}`;
};
exports.updateCallback = updateCallback;
const prepareUpdateQuery = (updateValues, filters, tableName, name) => {
    const text = `UPDATE "${tableName}" SET ${(0, exports.updateCallback)(
        updateValues,
        0
    )} WHERE ${(0, exports.filtersCallback)(
        filters,
        0,
        updateValues.length + 1
    )}`;
    const values = [];
    for (const element of updateValues) {
        values.push(element.value);
    }
    for (const element of filters) {
        values.push(element.value);
    }
    const preparedQuery = {
        name,
        text,
        values,
    };
    return preparedQuery;
};
exports.prepareUpdateQuery = prepareUpdateQuery;
