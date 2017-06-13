window.mbi.view = window.mbi.view || {};
window.mbi.view.analyze = (function( data, html, db ) {

    var SQL_OPERATION_EQUALS = "=";

    var exports = {};
    var elemSelectMeasureOperation;
    var elemSelectMeasure;
    var elemSelectDimension;
    var elemFiltersContainer;
    var elemDivDebugSQL;
    var barChart;

    /*
     * Private
     */

    function setFiltersAccordingToAssigment() {
        elemSelectMeasureOperation.value = "COUNT";
        elemSelectMeasure.value = "SheetDataBase.Estimate";
        elemSelectDimension.value = "SheetUserGroup.UserGroup";

        data.filterGroups = [
            {
                "filters": [
                    {
                        "field": "SheetDataBase.Priority",
                        "condition": "=",
                        "expected": "P0"
                    },
                    {
                        "field": "SheetDataBase.Priority",
                        "condition": "=",
                        "expected": "P1"
                    }
                ]
            },
            {
                "filters": [
                    {
                        "field": "SheetDataBase.Priority",
                        "condition": "=",
                        "expected": "P2"
                    },
                    {
                        "field": "SheetDataBase.Priority",
                        "condition": "=",
                        "expected": "P3"
                    }
                ]
            },
            {
                "filters": [
                    {
                        "field": "SheetDataBase.Priority",
                        "condition": "=",
                        "expected": "P4"
                    },
                    {
                        "field": "SheetDataBase.Priority",
                        "condition": "=",
                        "expected": "P5"
                    }
                ]
            }
        ];
        renderFilters();
        updateSQL();
    }

    function getChartBackgroundColor( index ) {
        return [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
        ][index];
    }

    function getChartBorderColor( index ) {
        return [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
        ][index];
    }

    function appendSelectOptionsForFilterCondition( select ) {
        html.appendOption(select, "Equals", SQL_OPERATION_EQUALS);
    }

    function getAllTableColumns() {
        var columnNames = [];
        data.sheets.forEach(function( sheet ) {
            sheet.columnNames.forEach(function( columnName ) {
                columnNames.push(columnName);
            });
        });
        return columnNames;
    }

    function appendSelectOptionsFromTableColumns( select ) {
        data.sheets.forEach(function( sheet ) {
            sheet.columnNames.forEach(function( columnName ) {
                var label = sheet.name + "." + columnName;
                var value = db.sanitizeTableName(sheet.name) + "." + db.sanitizeColumnName(columnName);
                html.appendOption(select, label, value);
            });
        });
    }

    function onAddFilterGroupButtonClick() {

        var filterGroup = {
            label: "My newly created filter",
            filters: []
        };
        addNewFiltersToFilterGroup(filterGroup);

        data.filterGroups.push(filterGroup);
        renderFilters();
        updateSQL();
    }

    function addNewFiltersToFilterGroup( filterGroup ) {
        filterGroup.filters.push({
            field: getAllTableColumns()[0],
            condition: SQL_OPERATION_EQUALS,
            expected: ""
        });
    }

    function renderFilters() {

        html.clear(elemFiltersContainer);

        data.filterGroups.forEach(function( filterGroup, filterGroupIndex ) {

            var panelFilterGroup = html.appendBootstrapPanel(elemFiltersContainer, "Filter group #" + (filterGroupIndex + 1));

            filterGroup.filters.forEach(function( filter, filterIndex ) {

                // Field
                html.appendDiv(panelFilterGroup, {
                    text: "Field",
                    classes: "mbi-margin-bottom-5"
                });
                var filterSelectField = html.appendSelect(panelFilterGroup, {
                    classes: "mbi-margin-bottom-10",
                    onChange: function( event ) {
                        filter.field = event.target.value;
                        updateSQL();
                    }
                });
                appendSelectOptionsFromTableColumns(filterSelectField);

                html.appendDiv(panelFilterGroup, {
                    text: "Condition",
                    classes: "mbi-margin-bottom-5"
                });
                var filterSelectCondition = html.appendSelect(panelFilterGroup, {
                    classes: "mbi-margin-bottom-10",
                    onChange: function( event ) {
                        filter.condition = event.target.value;
                        updateSQL();
                    }
                });
                appendSelectOptionsForFilterCondition(filterSelectCondition);
                html.appendDiv(panelFilterGroup, {
                    text: "Value",
                    classes: "mbi-margin-bottom-5"
                });
                html.appendInput(panelFilterGroup, {
                    value: filter.expected,
                    classes: "mbi-margin-bottom-10",
                    onKeyUp: function( event ) {
                        filter.expected = event.target.value;
                        updateSQL();
                    }
                });

                // Delete filter
                html.appendButton(panelFilterGroup, "Delete above filter", function() {
                    filterGroup.filters.splice(filterIndex, 1);
                    if( !filterGroup.filters.length ) {
                        data.filterGroups.splice(filterGroupIndex, 1);
                    }
                    renderFilters();
                    updateSQL();
                }, {
                    type: "danger",
                    size: "xs",
                    classes: "mbi-width-100 mbi-margin-bottom-20"
                });

            });

            html.appendButton(panelFilterGroup, "Add a new \"OR\" filter in this group", function() {
                addNewFiltersToFilterGroup(filterGroup);
                renderFilters();
                updateSQL();
            }, {
                classes: "mbi-width-100 mbi-margin-bottom-5"
            });

            // Delete group button
            html.appendButton(panelFilterGroup, "Delete this whole filter group", function() {
                data.filterGroups.splice(filterGroupIndex, 1);
                renderFilters();
                updateSQL();
            }, {
                type: "danger",
                classes: "mbi-width-100 mbi-margin-bottom-10"
            });

        });

    }

    function createSQL( dimensionValue, measureOperation, measureValue, filters ) {
        var sql = "";
        sql += "SELECT " + dimensionValue + " AS dimension, " + measureOperation + "(" + measureValue + ") AS measure\n";
//        sql += "FROM " + "SheetDataBase" + "\n";
        sql += "FROM " + db.sanitizeTableName(data.sheets[0].name) + "\n";
//        sql += "//INNER JOIN SheetUserGroup ON SheetDataBase.Assignee = SheetUserGroup.Name\n";
        data.joins.forEach(function( joinData ) {
            sql += "LEFT JOIN " + joinData.targetTable + " ON " + joinData.sourceTable + "." + joinData.sourceField + " = " + joinData.targetTable + "." + joinData.targetField + "\n";
        });

        if( filters ) {
            sql += "WHERE ( ";
            filters.forEach(function( filter, filterIndex ) {
                sql += filter.field + " " + filter.condition + " \"" + filter.expected + "\" ";
                if( filterIndex !== filters.length - 1 ) {
                    sql += "OR "
                }
            });
            sql += ")\n"
        }

        sql += "GROUP BY " + elemSelectDimension.value + "\n";
        return sql;
    }

    function updateSQL() {

        // Clear the data
        data.sqls = [];

        // If we have multiple filter groups
        if( data.filterGroups.length ) {
            data.filterGroups.forEach(function( filterGroup ) {
                var sql = createSQL(elemSelectDimension.value, elemSelectMeasureOperation.value, elemSelectMeasure.value, filterGroup.filters);
                data.sqls.push(sql);
            });
        } else {

            var sql = createSQL(elemSelectDimension.value, elemSelectMeasureOperation.value, elemSelectMeasure.value);

            data.sqls.push(sql);

        }

        var textAreaValue = "";
        data.sqls.forEach(function( sql ) {
            textAreaValue += sql + "\n";
        });
        elemDivDebugSQL.textContent = textAreaValue;

        // Update che chart
        updateChart();

    }

    function createDataSetLabel( index ) {

        var filterGroup;
        var filterLabels;
        var label = "";

        if( data.filterGroups.length ) {

            filterGroup = data.filterGroups[index];
            filterLabels = [];

            filterGroup.filters.forEach(function( filter ) {
                filterLabels.push(filter.field + " " + filter.condition + " " + filter.expected);
            });

            label += filterLabels.join(" and ");

        } else {

            switch( elemSelectMeasureOperation.value ) {
                case "COUNT": {
                    label += "Counted ";
                    break
                }
                case "SUM": {
                    label += "Summarized ";
                    break
                }
                case "AVG": {
                    label += "Average ";
                    break
                }
                default: {
                    label += elemSelectMeasureOperation.value + " ";
                }
            }

            label += elemSelectMeasure.value + " per " + elemSelectDimension.value;

        }

        return label;
    }

    function updateChart() {

        var chartData = {
            labels: [],
            dataSets: []
        };

        data.sqls.forEach(function( sql, sqlIndex ) {
            var results = db.exec(sql);
            var dataSet = {
                label: "##no set##",
                data: [],
                backgroundColor: [
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex),
                    getChartBackgroundColor(sqlIndex)
                ],
                borderColor: [
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex),
                    getChartBorderColor(sqlIndex)
                ]
            };

            results.forEach(function( row ) {

                // Fix the label
                dataSet.label = createDataSetLabel(sqlIndex);

                // only capture the labels if its the first SQL
                if( sqlIndex === 0 ) {
                    chartData.labels.push(row["dimension"]);
                }

                dataSet.data.push(row["measure"]);

            });
            chartData.dataSets.push(dataSet);
        });

        /*
         * Set the new chart data
         */

        barChart.data.labels = chartData.labels;
        barChart.data.datasets = chartData.dataSets;

        /*
         * Update the chart
         */

        barChart.update();

    }

    function renderLeft( parent ) {

        var panelChart;
        var panelDebugSQLPanel;

        panelChart = html.appendBootstrapPanel(parent, "Data visualization");

        /*
         * Canvas
         */

        var canvas = mbi.html.appendCanvas(panelChart, 400, 400);
        var ctx = canvas.getContext("2d");
        // This is basically mock data just to init the chart.js for debugging purposes
        barChart = new Chart(ctx, {
            type: "horizontalBar",
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                },
                maintainAspectRatio: false
            },
            data: {
                labels: ["January", "February"],
                datasets: [{
                    label: '# of Votes',
                    data: [2, 19],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255,99,132,1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
                    ]
                }]
            }
        });

        /*
         * TextArea SQL
         */

        panelDebugSQLPanel = html.appendBootstrapPanel(parent, "Debug SQL statements");

        html.appendDiv(panelDebugSQLPanel, {
            text: "These are the raw SQL statements that are created in order to visualize the data for you. These are updated in real time and executed against the in-memory SQL database.",
            classes: "mbi-margin-bottom-10"
        });
        elemDivDebugSQL = html.appendPre(panelDebugSQLPanel);

    }

    function renderRight( parent ) {

        /*
         * Measurement
         */

        var panelAddNewFilterGroup;
        var panelBasic = html.appendBootstrapPanel(parent, "Measure & Dimension");

        html.appendDiv(panelBasic, {
            text: "Measure operation",
            classes: "mbi-margin-bottom-5"
        });
        elemSelectMeasureOperation = html.appendSelect(panelBasic, {
            onChange: updateSQL,
            classes: "mbi-margin-bottom-10"
        });
        html.appendOption(elemSelectMeasureOperation, "Count", "COUNT");
        html.appendOption(elemSelectMeasureOperation, "Summarize", "SUM");
        html.appendOption(elemSelectMeasureOperation, "Average", "AVG");

        html.appendDiv(panelBasic, {
            text: "Measure field",
            classes: "mbi-margin-bottom-5"
        });
        elemSelectMeasure = html.appendSelect(panelBasic, {
            onChange: updateSQL,
            classes: "mbi-margin-bottom-10"
        });
        appendSelectOptionsFromTableColumns(elemSelectMeasure);

        /*
         * Dimension
         */

        html.appendDiv(panelBasic, {
            text: "Dimension field",
            classes: "mbi-margin-bottom-5"
        });
        elemSelectDimension = html.appendSelect(panelBasic, {
            onChange: updateSQL,
            classes: "mbi-margin-bottom-10"
        });
        appendSelectOptionsFromTableColumns(elemSelectDimension);

        /*
         * Filters
         */

        panelAddNewFilterGroup = html.appendBootstrapPanel(parent, "Filter groups");
        html.appendButton(panelAddNewFilterGroup, "Add new filter group", onAddFilterGroupButtonClick, {
            classes: "mbi-width-100"
        });

        elemFiltersContainer = html.appendDiv(parent);

    }

    /*
     * Public
     */

    exports.render = function( parent ) {

        var alertContainer;
        var elemSecretAssignmentTipBox;
        var text;
        var grid;
        var main;

        main = html.appendBootstrap12(parent);

        html.appendHeader1(main, "Step 4 - Data Discovery");

        alertContainer = html.appendBootstrapAlert(parent);
        {
            html.appendDiv(alertContainer, {
                text: "All the source data was successfully loaded into an in-memory SQL database!",
                classes: "mbi-margin-bottom-5"
            });
            html.appendDiv(alertContainer, {
                text: "Feel free to explore the data and do some Data Discovery by specifying and tweaking your Measure, Dimension and Filters to the right."
            });
        }

        elemSecretAssignmentTipBox = html.appendBootstrapAlert(parent, {
            type: "info"
        });
        text = "";
        text += "Pss, Secret Assignment Tip! In the assignment Massive wants to see each group's estimations over time. ";
        text += "To achieve that the measure operation should be \"Summarized\", field be \"Estimate\" and dimension field be \"UserGroup\", so the chart shows the estimations per group. ";
        text += "To create a stacked bar, three \"filter groups\" are required. Each group contains two \"filters\" where the field is \"Priority\" and the value be \"P0\", \"P1\", etc.";
        html.appendDiv(elemSecretAssignmentTipBox, {
            text: text,
            classes: "mbi-secret-tip mbi-margin-bottom-5"
        });
        html.appendButton(elemSecretAssignmentTipBox, "or simply click here and I will set the filters accurately for you to solve the assignment", setFiltersAccordingToAssigment, {
            size: "xs"
        });

        grid = html.appendBootstrap93(parent);

        renderLeft(grid.left);
        renderRight(grid.right);

        /*
         * Update
         */

        renderFilters();
        updateSQL();

    };

    return exports;

}(mbi.data, mbi.html, mbi.db));
