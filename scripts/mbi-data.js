window.mbi.data = (function() {

    return {
        // SQL joins are saved here from the transform view
        joins: [],
        // contains all the filter groups for the analyze view
        filterGroups: [],
        // contains all the SQL for the analyze view
        sqls: []
    };

}());