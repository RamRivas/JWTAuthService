import {
    FilterParameter,
    JoinParameter,
    PreparedQuery,
    KeyValuePair,
} from '../types';

export const filtersCallback = (
    filters: Array<FilterParameter>,
    index: number,
    paramIndex: number | undefined = undefined
): string => {
    const { key, operator, logicOperator } = filters[index];
    return index + 1 === filters.length
        ? `"${key}"${operator}$${!paramIndex ? index + 1 : paramIndex}`
        : `"${key}"${operator}$${
            !paramIndex ? index + 1 : paramIndex
        } ${logicOperator} ${filtersCallback(
            filters,
            index + 1,
            !paramIndex ? undefined : paramIndex + 1
        )}`;
};

export const columnsCallback = (
    columns: Array<string>,
    index: number,
    tableName: string
): string => {
    return index + 1 === columns.length
        ? `"${tableName}"."${columns[index]}"`
        : `"${tableName}"."${columns[index]}", ${columnsCallback(
            columns,
            index + 1,
            tableName
        )}`;
};

export const columnsCallbackForInset = (
    columns: KeyValuePair[],
    index: number
): string => {
    const { key } = columns[index];
    return index + 1 === columns.length
        ? `${key}`
        : `${key}, ${columnsCallbackForInset(columns, index + 1)}`;
};

export const valuesCallback = (
    columns: KeyValuePair[],
    index: number
): string => {
    return index + 1 === columns.length
        ? `$${index + 1}`
        : `$${index + 1}, ${valuesCallback(columns, index + 1)}`;
};

export const joinsCallback = (
    joins: Array<JoinParameter>,
    index: number
): string => {
    const { joinType, tableName, filters } = joins[index];
    return index + 1 === joins.length
        ? `${joinType} JOIN "${tableName}" ON ${joinFiltersCallback(
            filters,
            0
        )} ${joinsCallback(joins, index + 1)}`
        : `${joinType} JOIN "${tableName}" ON ${joinFiltersCallback(
            filters,
            0
        )} `;
};

export const joinFiltersCallback = (
    filters: Array<FilterParameter>,
    index: number
): string => {
    const { key, value, operator, logicOperator } = filters[index];
    return index + 1 === filters.length
        ? `"${key}"${operator}${value}`
        : `"${key}"${operator}${value} ${logicOperator} ${joinFiltersCallback(
            filters,
            index + 1
        )}`;
};

export const prepareSelectQuery = (
    tableName: string,
    name: string,
    columns: Array<string> | undefined,
    filters: Array<FilterParameter> | undefined,
    joins: Array<JoinParameter> | undefined = undefined
): PreparedQuery => {
    const text = `SELECT ${
        columns ? columnsCallback(columns, 0, tableName) : `"${tableName}".*`
    } FROM "${tableName}" ${joins ? joinsCallback(joins, 0) : ''} ${
        filters ? `WHERE ${filtersCallback(filters, 0)}` : ''
    }`;
    const values = [];

    if (filters) {
        for (const element of filters) {
            values.push(element.value);
        }
    }

    const preparedQuery: PreparedQuery = {
        name,
        text,
        values,
    };

    return preparedQuery;
};

export const updateCallback = (
    updateValues: Array<KeyValuePair>,
    index: number
): string => {
    const { key } = updateValues[index];
    return index + 1 === updateValues.length
        ? `"${key}"=$${index + 1}`
        : `${key}=$${index + 1}, ${updateCallback(updateValues, index + 1)}`;
};

export const prepareUpdateQuery = (
    updateValues: Array<KeyValuePair>,
    filters: Array<FilterParameter>,
    tableName: string,
    name: string
): PreparedQuery => {
    const text = `UPDATE "${tableName}" SET ${updateCallback(
        updateValues,
        0
    )} WHERE ${filtersCallback(filters, 0, updateValues.length + 1)}`;
    const values = [];

    for (const element of updateValues) {
        values.push(element.value);
    }

    for (const element of filters) {
        values.push(element.value);
    }

    const preparedQuery: PreparedQuery = {
        name,
        text,
        values,
    };

    return preparedQuery;
};

export const prepareInsertQuery = (
    name: string,
    insertValues: Array<KeyValuePair>,
    tableName: string
): PreparedQuery => {
    try {
        const text = `INSERT INTO "${tableName}" (${columnsCallbackForInset(
            insertValues,
            0
        )}) VALUES(${valuesCallback(insertValues, 0)})`;
        const values = [];

        for (const element of insertValues) {
            values.push(element.value);
        }

        return {
            name,
            text,
            values,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(
                `The current error ocurred while trying to prepare an insert statement: ${error.message}`
            );
        } else {
            throw new Error('Unexpected Error');
        }
    }
};
