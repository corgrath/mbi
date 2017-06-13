window.mbi.navigator = (function( html, notificator ) {

    /*
     * Private
     */

    var exports = {};

    function renderNavigator( view ) {

        var items;
        var parent;

        items = [
            {
                text: "Step 1 - Extract",
                subText: "Specify the data source",
                active: view === mbi.view.extract
            },
            {
                text: "Step 2 - Transform",
                subText: "Prepare the source data prior to loading",
                active: view === mbi.view.transform
            },
            {
                text: "Step 3 - Load",
                subText: "Review and load in the source data",
                active: view === mbi.view.load
            },
            {
                text: "Step 4 - Data Discovery",
                subText: "Visualize and analyze the data",
                active: view === mbi.view.analyze
            }
        ];

        parent = html.get("#mbi-navigator", true);

        html.appendBootstrapNavBar(parent, items);

    }

    /*
     * Public
     */

    exports.show = function( view ) {

        var parent;

        // Clear any old error messages
        notificator.clearErrors();

        parent = html.get("#mbi-view-container", true);
//        html.clear(parent);

        view.render(parent);

        renderNavigator(view);

    };

    return exports;

}(mbi.html, mbi.notificator));