window.mbi.db = (function( alasql ) {

    /*
     * Private
     */

    var exports = {};

    /*
     * Public
     */

    exports.sanitizeTableName = function( tableName ) {
        return "Sheet" + tableName;
    };

    exports.sanitizeColumnName = function( columnName ) {
        columnName = columnName.replace(/\W/g, "");
        return columnName;
    };

    exports.exec = function( sql ) {
        console.log("[mbi.db] Executing SQL:", sql);
        var results = alasql(sql);
        console.log("[mbi.db] Results:", results);
        return results;
    };

    return exports;

}(window.alasql));