window.mbi.view = window.mbi.view || {};
window.mbi.view.extract = (function( data, html, navigator, notificator ) {

    /*
     * Private
     */

    var exports = {};
    var elemButton;
    var elemFileInput;
    var sheetColumnIDs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    function getFile() {
        return elemFileInput.files[0];
    }

    function parseXLSXFile( xlsxFile, callback ) {

        if( !xlsxFile ) {
            notificator.showError("No file was given.");
            return;
        }

        var reader = new FileReader();

        reader.onload = function( event ) {

            var fileData;
            var workbook;
            var responseSheets;

            fileData = event.target.result;

            workbook = window.XLSX.read(fileData, {
                type: "binary"
            });

            if( !workbook.Strings ) {
                notificator.showError("The given file seems empty.");
                return;
            }

            console.log("WORKBOOK", workbook);
            responseSheets = [];

            workbook.SheetNames.forEach(function( sheetName ) {

                var sheetData = workbook.Sheets[sheetName];
                var rows = XLSX.utils.sheet_to_row_object_array(sheetData);
                var columnNames = [];
                var columnTypes = [];

                // Figure out the column names
                sheetColumnIDs.forEach(function( letter ) {
                    var cell = sheetData[letter + "1"];
                    if( cell ) {
                        columnNames.push(cell.w);
                    }
                });

                // Figure out the column data types
                sheetColumnIDs.forEach(function( letter ) {
                    var cell = sheetData[letter + "2"];
                    if( cell ) {
                        columnTypes.push(isNaN(cell.w) ? "STRING" : "INT");
                    }
                });

                // Create a new sheet
                responseSheets.push({
                    name: sheetName,
                    columnNames: columnNames,
                    columnTypes: columnTypes,
                    rows: rows
                });

            });

            callback(responseSheets)

        };

        reader.onerror = function( exception ) {
            notificator.showError(exception);
        };

        // Start reading the file
        reader.readAsBinaryString(xlsxFile);

    }

    function onNextButtonClick() {

        var file = getFile();

        if( !file ) {
            notificator.showError("No file selected.");
            return;
        }

        parseXLSXFile(file, function( sheets ) {
            data.sheets = sheets;
            navigator.show(window.mbi.view.transform);
        });

    }

    function onFileInputChange() {
        elemButton.disabled = !getFile();
    }

    /*
     * Public
     */

    exports.render = function( parent ) {

        var div;

        parent = html.appendBootstrap12(parent);

        // Render the header
        html.appendHeader1(parent, "Step 1 - Extract");

        var panelMain = html.appendBootstrapPanel(parent, "Select source data");

        html.appendDiv(panelMain, {
            text: "Please select a Microsoft Excel Open XML Format Spreadsheet (.xslx) file to extract the data from.",
            classes: "mbi-margin-bottom-10"
        });

        elemFileInput = html.appendInput(panelMain, {
            type: "file",
            accept: ".xlsx",
            classes: "mbi-width-auto mbi-margin-bottom-20",
            onChanged: onFileInputChange
        });

        div = html.appendDiv(parent, {
            classes: "mbi-text-align-right"
        });
        elemButton = html.appendButton(div, "Extract data from file", onNextButtonClick, {
            disabled: true
        });

    };

    return exports;

}(mbi.data, mbi.html, mbi.navigator, mbi.notificator));