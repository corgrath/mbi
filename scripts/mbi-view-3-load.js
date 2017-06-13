window.mbi.view = window.mbi.view || {};
window.mbi.view.load = (function( data, html, navigator ) {

    /*
     * Private
     */

    var exports = {};

    /*
     * Public
     */

    exports.render = function( parent ) {

        var alertContainer;
        var panelLoadStatements;
        var div;

        parent = html.appendBootstrap12(parent);

        html.appendHeader1(parent, "Step 3 - Load");

        alertContainer = html.appendBootstrapAlert(parent);
        html.appendDiv(alertContainer, {
            text: "Great news, we are now ready to load your data into the our in-memory SQL database!",
            classes: "mbi-margin-bottom-5"
        });
        html.appendDiv(alertContainer, {
            text: "We have also analyzed the data from your sheets and made some educated guesses what kind of data type (STRING or INT) each column contains."
        });

        panelLoadStatements = html.appendBootstrapPanel(parent, "Review the final load statements");
        html.appendDiv(panelLoadStatements, {
            text: "Feel free to review the SQL statements below and when you feel ready please continue.",
            classes: "mbi-margin-bottom-10"
        });

        var sql = "";

        data.sheets.forEach(function( sheet ) {

            var sanitizedColumns = [];
            for( var i = 0; i < sheet.columnNames.length; i++ ) {
                var columnName = sheet.columnNames[i];
                var columnType = sheet.columnTypes[i];
                sanitizedColumns.push("  " + mbi.db.sanitizeColumnName(columnName) + " " + columnType);
            }
            sql += "CREATE TABLE " + mbi.db.sanitizeTableName(sheet.name) + " (\n" + sanitizedColumns.join(",\n") + "\n);\n";

            sheet.rows.forEach(function( row ) {
                var cellDatas = [];
                sheet.columnNames.forEach(function( column ) {
                    var cellData = row[column];
                    if( isNaN(cellData) ) {
                        cellData = "\"" + (cellData ? cellData.replace(/\W/g, "") : "") + "\"";
                    }
                    cellDatas.push(cellData);
                });
                sql += "INSERT INTO " + mbi.db.sanitizeTableName(sheet.name) + " ( " + cellDatas.join(", ") + " );\n";
            });

            sql += "\n";

        });

        html.appendPre(panelLoadStatements, {
            text: sql,
            classes: "mbi-pre--load"
        });

        div = html.appendDiv(parent, {
            classes: "mbi-text-align-right"
        });
        html.appendButton(div, "Looks great, load it in buddy!", function() {
            mbi.db.exec(sql);
            navigator.show(window.mbi.view.analyze);
        });

    };

    return exports;

}(mbi.data, mbi.html, mbi.navigator));