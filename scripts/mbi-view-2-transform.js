window.mbi.view = window.mbi.view || {};
window.mbi.view.transform = (function( data, html, db, navigator ) {

    /*
     * Private
     */

    var exports = {};

    function getAllTableColumnsSanitized( sheet ) {
        var sanitizedColumnNames = [];
        sheet.columnNames.forEach(function( columnName ) {
            sanitizedColumnNames.push(db.sanitizeColumnName(columnName));
        });
        return sanitizedColumnNames;
    }

    function appendSelectOptionsFromSheetColumns( select, sheet ) {
        sheet.columnNames.forEach(function( columnName ) {
            var label = columnName;
            var value = db.sanitizeColumnName(columnName);
            html.appendOption(select, label, value);
        });
    }

    function renderSheetsDataPanel( parent ) {

        var table;
        var thead;
        var tbody;
        var row;

        parent = html.appendBootstrapPanel(parent, "Source data information");

        html.appendDiv(parent, {
            text: "We found the following sheets:",
            classes: "mbi-margin-bottom-10"
        });

        table = html.appendTable(parent, {
            classes: "mbi-margin-bottom-20"
        });
        thead = html.appendTableHead(table);
        row = html.appendTableRow(thead);
        html.appendTableRowCellHead(row, {
            text: "Sheet name"
        });
        html.appendTableRowCellHead(row, {
            text: "Number of columns"
        });
        html.appendTableRowCellHead(row, {
            text: "Number of rows"
        });
        tbody = html.appendTableBody(table);
        data.sheets.forEach(function( sheet ) {
            row = html.appendTableRow(tbody);
            html.appendTableRowCell(row, {
                text: sheet.name
            });
            html.appendTableRowCell(row, {
                text: Object.keys(sheet.rows[0]).length
            });
            html.appendTableRowCell(row, {
                text: sheet.rows.length
            });
        });
    }

    function renderPrepareDataPanel( parent ) {

        var elemSecretAssignmentTipBox;

        if( data.sheets.length ) {

            parent = html.appendBootstrapPanel(parent, "Prepare source data");

            html.appendDiv(parent, {
                text: "Since your source data has multiple sheets, it is possible to join the sheets by matching columns in each sheet. Please specify which columns below should be linked before continuing.",
                classes: "mbi-margin-bottom-10"
            });

            elemSecretAssignmentTipBox = html.appendBootstrapAlert(parent, {
                type: "info"
            });
            html.appendDiv(elemSecretAssignmentTipBox, {
                text: "Pss, Secret Assignment Tip! In the XLSX file given by Massive, there are two sheets. The column \"DataBase.Assignee\" should be linked to \"UserGroup.Name\" to join these two sheets together.",
                classes: "mbi-secret-tip"
            });

            var firstSheet = data.sheets[0];

            data.sheets.forEach(function( sheet, sheetIndex ) {

                var joinData;

                if( sheetIndex === 0 ) {
                    return;
                }

                joinData = {
                    sourceTable: db.sanitizeTableName(firstSheet.name),
                    sourceField: getAllTableColumnsSanitized(firstSheet)[0],
                    targetTable: db.sanitizeTableName(sheet.name),
                    targetField: getAllTableColumnsSanitized(sheet)[0]
                };

                data.joins.push(joinData);

                var grid = html.appendBootstrap66(parent);

                // Left side
                html.appendDiv(grid.left, {
                    text: firstSheet.name,
                    classes: "mbi-margin-bottom-5"
                });
                var selectFirstSheetJoin = mbi.html.appendSelect(grid.left, {
                    classes: "mbi-margin-bottom-10",
                    onChange: function( event ) {
                        joinData.sourceField = event.target.value
                    }
                });
                appendSelectOptionsFromSheetColumns(selectFirstSheetJoin, firstSheet);

                // Right side
                html.appendDiv(grid.right, {
                    text: sheet.name,
                    classes: "mbi-margin-bottom-5"
                });
                var selectSecondSheetJoin = mbi.html.appendSelect(grid.right, {
                    classes: "mbi-margin-bottom-10",
                    onChange: function( event ) {
                        joinData.targetField = event.target.value
                    }
                });
                appendSelectOptionsFromSheetColumns(selectSecondSheetJoin, sheet);

            });

        }

    }

    /*
     * Public
     */

    exports.render = function( parent ) {

        var alertContainer;
        var div;

        parent = html.appendBootstrap12(parent);

        html.appendHeader1(parent, "Step 2 - Transform");

        alertContainer = html.appendBootstrapAlert(parent);
        html.appendDiv(alertContainer, {
            text: "Your source data file was successfully read!"
        });

        renderSheetsDataPanel(parent);
        renderPrepareDataPanel(parent);

        div = html.appendDiv(parent, {
            classes: "mbi-text-align-right"
        });
        html.appendButton(div, "The data is prepared, continue to load", function() {
            navigator.show(window.mbi.view.load);
        });

    };

    return exports;

}(mbi.data, mbi.html, mbi.db, mbi.navigator));