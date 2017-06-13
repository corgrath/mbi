window.mbi.notificator = (function( html ) {

    /*
     * Private
     */

    var exports = {};
    var elemNotificator = html.get("#mbi-notificator");

    /*
     * Public
     */

    exports.clearErrors = function() {
        html.clear(elemNotificator);
    };

    exports.showError = function( message ) {

        exports.clearErrors();

        html.appendDiv(elemNotificator, {
            classes: "alert alert-danger",
            text: message
        });

//        alert("error " + message);

    };

    return exports;

}(mbi.html));