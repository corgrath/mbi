window.mbi.html = (function() {

    /*
     * Private
     */

    var exports = {};

    function createElement( parent, tagName ) {
        var element = document.createElement(tagName);
        parent.appendChild(element);
        return element;
    }

    /*
     * Public
     */

    exports.get = function( selector, clear ) {
        var element = document.querySelector(selector);
        if( clear ) {
            exports.clear(element);
        }
        return element;
    };

    exports.clear = function( parent ) {
        while( parent.firstChild ) {
            parent.removeChild(parent.firstChild);
        }
    };

    exports.appendHeader1 = function( parent, text ) {
        var element = createElement(parent, "h1");
        element.textContent = text;
        element.className = "mbi-h1";
        return element;
    };

    exports.appendInput = function( parent, optional ) {
        var input = createElement(parent, "input");
        var className = "form-control ";
        if( optional && optional.type ) {
            input.type = optional.type;
        }
        if( optional && optional.accept ) {
            input.accept = optional.accept;
        }
        if( optional && optional.onChanged ) {
            input.addEventListener("change", optional.onChanged);
        }
        if( optional && optional.value ) {
            input.value = optional.value;
        }
        if( optional && optional.onKeyUp ) {
            input.addEventListener("keyup", optional.onKeyUp);
        }
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        input.className = className;
        return input;
    };

    exports.appendOption = function( parent, label, value ) {
        var option = createElement(parent, "option");
        option.textContent = label;
        option.value = value;
        return option;
    };

    exports.appendSelect = function( parent, optional ) {
        var select = createElement(parent, "select");
        var className = "form-control ";
        if( optional && optional.onChange ) {
            select.addEventListener("change", optional.onChange);
        }
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        select.className = className;
        return select;
    };

    exports.appendDiv = function( parent, optional ) {
        var element = createElement(parent, "div");
        if( optional && optional.text ) {
            element.textContent = optional.text;
        }
        if( optional && optional.classes ) {
            element.className = optional.classes;
        }
        return element;
    };

    exports.appendButton = function( parent, label, clickFunction, optional ) {
        var button = createElement(parent, "button");
        var type = optional && optional.type;
        var className = "btn btn-" + (type || "primary") + " ";

        button.textContent = label;
        button.addEventListener("click", clickFunction);
        if( optional && optional.disabled ) {
            button.disabled = optional.disabled;
        }
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        if( optional && optional.size ) {
            className += "btn-" + optional.size + " ";
        }
        button.className = className;
        return button;
    };

    exports.appendPre = function( parent, optional ) {
        var element = createElement(parent, "pre");
        var className = "mbi-pre ";
        if( optional && optional.text ) {
            element.textContent = optional.text;
        }
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        element.className = className;
        return element;
    };

    exports.appendCanvas = function( parent, width, height ) {
        var element = createElement(parent, "canvas");
        element.setAttribute("width", width);
        element.setAttribute("height", height);
        return element;
    };

    exports.appendUnsortedList = function( parent, optional ) {
        var element = createElement(parent, "ul");
        var className = "";
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        element.className = className;
        return element;
    };

    exports.appendListItem = function( parent, optional ) {
        var element = createElement(parent, "li");
        var className = "";
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        element.className = className;
        return element;
    };

    exports.appendAnchor = function( parent, optional ) {
        var element = createElement(parent, "a");
        var className = "";
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        element.className = className;
        return element;
    };

    exports.appendTable = function( parent, optional ) {
        var table = createElement(parent, "table");
        var className = "table table-striped table-responsive mbi-table ";
        if( optional && optional.classes ) {
            className += optional.classes + " ";
        }
        table.className = className;
        return table;
    };

    exports.appendTableHead = function( parent ) {
        var thead = createElement(parent, "thead");
        return thead;
    };

    exports.appendTableBody = function( parent ) {
        var tbody = createElement(parent, "tbody");
        return tbody;
    };

    exports.appendTableRow = function( parent ) {
        var tr = createElement(parent, "tr");
        return tr;
    };

    exports.appendTableRowCellHead = function( parent, optional ) {
        var th = createElement(parent, "th");
        if( optional && optional.text ) {
            th.textContent = optional.text;
        }
        return th;
    };

    exports.appendTableRowCell = function( parent, optional ) {
        var th = createElement(parent, "td");
        if( optional && optional.text ) {
            th.textContent = optional.text;
        }
        return th;
    };

    exports.appendBootstrap12 = function( parent ) {
        var row = exports.appendDiv(parent, {
            classes: "row"
        });
        return exports.appendDiv(row, {
            classes: "col-md-12"
        });
    };

    exports.appendBootstrap93 = function( parent ) {
        var row = exports.appendDiv(parent, {
            classes: "row"
        });
        var left = exports.appendDiv(row, {
            classes: "col-md-9"
        });
        var right = exports.appendDiv(row, {
            classes: "col-md-3"
        });
        return {
            left: left,
            right: right
        };
    };

    exports.appendBootstrap66 = function( parent ) {
        var row = exports.appendDiv(parent, {
            classes: "row"
        });
        var left = exports.appendDiv(row, {
            classes: "col-md-6"
        });
        var right = exports.appendDiv(row, {
            classes: "col-md-6"
        });
        return {
            left: left,
            right: right
        };
    };

    exports.appendBootstrapPanel = function( parent, label ) {
        var main = exports.appendDiv(parent, {
            classes: "panel panel-default"
        });
        exports.appendDiv(main, {
            classes: "panel-heading",
            text: label
        });
        return exports.appendDiv(main, {
            classes: "panel-body"
        });
    };

    exports.appendBootstrapAlert = function( parent, optional ) {
        var type = optional && optional.type;
        var className = "alert alert-" + (type || "success") + " ";
        return exports.appendDiv(parent, {
            classes: className
        });
    };

    exports.appendBootstrapNavBar = function( parent, items ) {

        var ul = exports.appendUnsortedList(parent, {
            classes: "nav nav-tabs nav-justified mbi-nav"
        });

        items.forEach(function( item ) {

            var anchor;
            var div;
            var li = exports.appendListItem(ul, {
                classes: item.active ? "active" : ""
            });

            anchor = exports.appendAnchor(li);

            exports.appendDiv(anchor, {
                text: item.text
            });

            div = exports.appendDiv(anchor, {
                text: item.subText
            });
            div.style.marginTop = "2px";
            div.style.fontSize = "10px";
            div.style.color = "gray";

        });

    };

    return exports;

}());