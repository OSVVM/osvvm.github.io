var MachineLoader = function()
{
    var _lines = {}; // Cache

    /*-----------------------------------------------------------------------*/

    var _makeColorFor = function( statistics )
    {
        if ( isNaN( parseInt( statistics ) ) )
            return "gray";

        if ( statistics.split( "/" )[ 0 ] == statistics.split( "/" )[ 1 ] )
            return "green";

        return "red";
    };

    /*-----------------------------------------------------------------------*/

    var _describeSignals = function( signals )
    {
        var result = "";

        $.each( signals, function( index, nameAndSource )
        {
            result += "<br>Source ";
            result += Tools.escapeHTML( nameAndSource.name );
            result += " = <span>";
            result += nameAndSource.path;
            result += "(";
            result += nameAndSource.line;
            result += ")</span>";
        } );

        return result;
    };

    /*-----------------------------------------------------------------------*/

    var _decorateTable = function( table )
    {
        TableDecorator.addHighlighting( table );
        TableDecorator.addExpanding( table );
        TableDecorator.loadView( Report.nameById[ table.parent().attr( "id" ) ], table );
        
        if ( CounterManager.isActive() )
            CounterManager.takeOver( table.find( ".toggle-static,.toggle-static-last" ).parent().next() );
    };

    /*-----------------------------------------------------------------------*/

    var _jumpToCode = function()
    {
        var span = $( this );
        var tabName = Report.nameById[ span.closest( ".ui-tabs-panel" ).attr( "id" ) ];

        if ( span.parent().prev().length )
        {
            // Jumping not from first column
            var pathAndLine = span.text().slice( 0, -1 ).split( "(" );
            var line = pathAndLine.pop();
            var path = pathAndLine.join( "(" );

            Report._scrollToLine( Report.idByName[ tabName + "::" + path ], line );
            return;
        }

        // Jumping from first column
        var row = span.parent().parent();
        var offset = 0;

        while ( !row.attr( "id" ) )
        {
            row = row.prev();
            ++offset;
        }

        var id = row.attr( "id" ).split( "-" ).pop();
        var scope = tabName.split( "::" ).pop();

        // TODO: Can be slow so think about improvement
        $.each( Report.cvg_data[ scope ].machine, function( index, value )
        {
            if ( value.id != id )
                return true;

            var path = Report.cvg_data[ scope ].machine[ index + offset ].path;
            var line = Report.cvg_data[ scope ].machine[ index + offset ].line;

            Report._scrollToLine( Report.idByName[ tabName + "::" + path ], line );
            return false;
        } );
    };

    /*-----------------------------------------------------------------------*/

    var _addTable = function( tab, bins )
    {
        if ( !bins )
        {
            tab.html( "No coverage data available for selected node." );
            return;
        }

        var table = "<table class='border machine-table'>";
        table += "<tr><th>FSM</th><th>Hits/Total</th><th>Extra Info</th></tr>";

        var statistics;

        $.each( bins, function( index, bin )
        {
            var isMachine = typeof bin.coverage != "undefined";
            var isGroup = typeof bin.statistics != "undefined";
            var isIllegal = isGroup && bin.name.indexOf( "Illegal" ) == 0;
            var isBin = typeof bin.hits != "undefined";

            var color = "";

            if ( isMachine )
                color = isNaN( parseFloat( bin.coverage ) )
                    ? "gray"
                    : ( parseFloat( bin.coverage ) >= bin.goal
                        ? "green"
                        : "red" );

            if ( isGroup && !isIllegal )
                color = _makeColorFor( bin.statistics );

            if ( isGroup && isIllegal )
                color = bin.statistics.charAt( 0 ) == "("
                    ? "gray"
                    : ( parseInt( bin.statistics )
                        ? "red"
                        : "gray" );

            var id = bin.id ? "rel-" + bin.id : "";
            var padding = isMachine ? 4 : ( isGroup ? 22 : 40 );
            var name = Tools.escapeHTML( bin.name );

            if ( typeof bin.path != "undefined" && typeof bin.line != "undefined" )
                name = "<span>" + name + "</span>";

            table += "<tr class='" + color + "' id='" + id + "'>";
            table += "<td style='padding-left:" + padding + "px'>";
            table += name;
            table += "</td><td>";
            table += isMachine ? bin.coverage : "";
            table += isBin ? bin.hits : "";
            table += isGroup && !isIllegal ? bin.statistics : "";
            table += "</td><td>";

            if ( isMachine )
            {
                table += "Source = <span>" + bin.path + "(" + bin.line + ")</span>";
                table += "<br>CURRENT = " + Tools.escapeHTML( bin.current[ 0 ] );
                table += _describeSignals( bin.current.slice( 1 ) );
                table += bin.next ? "<br>NEXT = " + Tools.escapeHTML( bin.next[ 0 ] ) : "";
                table += bin.next ? _describeSignals( bin.next.slice( 1 ) ) : "";
                table += bin.initial ? "<br>INITIAL = " + Tools.escapeHTML( bin.initial ) : "";
            }

            if ( typeof bin.value != "undefined" )
                table += "Value = " + bin.value;

            table += "</td></tr>";

            // Make place in source code for jumping there
            if ( bin.path && bin.line )
            {
                if ( typeof _lines[ bin.path ] == "undefined" )
                    _lines[ bin.path ] = {};

                if ( typeof _lines[ bin.path ][ bin.line ] == "undefined" )
                    _lines[ bin.path ][ bin.line ] = [];
            }

            // Put group statistics into this object
            if ( isMachine )
            {
                statistics = {};
                _lines[ bin.path ][ bin.line ].push( statistics );
            }

            // Will be displayed during source code creating
            if ( isGroup && !isIllegal )
                statistics[ bin.id.split( "" ).pop() ] = bin.statistics;
        } );

        table += "</table>";
        tab.html( table );

        if ( !Report.cvg_data.summary.options.fsmdebug )
            tab.find( "th:nth-child(3),td:nth-child(3)" ).css( "display", "none" );

        _decorateTable( tab.find( ".machine-table" ) );

        var links = tab.find( "span+span,td+td span" );
        links.css( "cursor", "pointer" ).css( "text-decoration", "underline" );
        links.click( _jumpToCode );
    };

    /*-----------------------------------------------------------------------*/

    var _mergeColors = function( first, second )
    {
        if ( first == "red" || second == "red" )
            return "red";

        if ( first == "green" || second == "green" )
            return "green";

        return "gray";
    };

    /*-----------------------------------------------------------------------*/

    var _jumpToTable = function()
    {
        var link = $( this );
        var tabName = Report.nameById[ link.closest( ".ui-tabs-panel" ).attr( "id" ) ];

        var scope = tabName.split( "::" )[ 1 ];
        var path = tabName.split( "::" )[ 2 ];
        var line = link.parent().prevAll().length + 1;
        var skip = link.prevAll( "code" ).length;

        var group = link.parent().parent().prevAll().length;
        group = group == 1 ? "s" : ( group == 2 ? "t" : "u" );

        // TODO: Can be slow so think about improvement
        $.each( Report.cvg_data[ scope ].machine, function( index, value )
        {
            if ( typeof value.coverage == "undefined" )
                return true;

            if ( value.path != path )
                return true;

            if ( value.line != line )
                return true;

            if ( skip )
            {
                --skip;
                return true;
            }

            Report.ui.content.tabs( "option", "active", 1 );
            Report._scrollToItem( value.id + group );
            return false;
        } );
    };

    /*-----------------------------------------------------------------------*/

    var _addCode = function( tab, lines, path )
    {
        // This shows code only
        Report._showCodeCoverage( tab.attr( "id" ), lines, path );

        var secondHeader = tab.find( "tr" ).eq( 0 ).find( "th" ).eq( 1 );
        secondHeader.text( "States" );
        secondHeader.after( "<th align='center'>Sequences</th>" );
        secondHeader.after( "<th align='center'>Transitions</th>" );
        secondHeader.next().addBack().next().addBack().css( "padding", "0 0.5em 0 1em" );

        tab.find( "tr" ).eq( 1 ).find( "th" ).eq( 1 ).after( "<th></th><th></th>" );

        var secondColumn = tab.find( "tr" ).eq( 2 ).find( "td" ).eq( 1 );
        secondColumn.after( secondColumn.clone() );
        secondColumn.after( secondColumn.clone() );

        $.each( lines, function( line, machines )
        {
            var states = "";
            var transitions = "";
            var sequences = "";
            var color = "";

            $.each( machines, function( index, machine )
            {
                if ( color )
                {
                    states += ",";
                    transitions += ",";
                    sequences += ",";
                }

                states += "<code>" + ( machine.s || "-" ) + "</code>";
                transitions += "<code>" + ( machine.t || "-" ) + "</code>";
                sequences += "<code>" + ( machine.u || "-" ) + "</code>";

                color = _mergeColors( color, _makeColorFor( machine.s ) );
                color = _mergeColors( color, _makeColorFor( machine.t ) );
                color = _mergeColors( color, _makeColorFor( machine.u ) );
            } );

            if ( $( states ).text().split( "/" ).length != 1 )
                secondColumn.children().eq( line - 1 ).html( states );
            if ( $( transitions ).text().split( "/" ).length != 1 )
                secondColumn.next().children().eq( line - 1 ).html( transitions );
            if ( $( sequences ).text().split( "/" ).length != 1 )
                secondColumn.next().next().children().eq( line - 1 ).html( sequences );

            secondColumn.prev().children().eq( line - 1 ).addClass( color );
            secondColumn.children().eq( line - 1 ).addClass( color );
            secondColumn.next().children().eq( line - 1 ).addClass( color );
            secondColumn.next().next().children().eq( line - 1 ).addClass( color );
            secondColumn.next().next().next().children().children().eq( line - 1 ).addClass( color );
        } );

        // Hide column if it has no data
        if ( secondColumn.text().split( "/" ).length == 1 )
            tab.find( "tr" ).find( "th:nth-child(2),td:nth-child(2)" ).hide();
        if ( secondColumn.next().text().split( "/" ).length == 1 )
            tab.find( "tr" ).find( "th:nth-child(3),td:nth-child(3)" ).hide();
        if ( secondColumn.next().next().text().split( "/" ).length == 1 )
            tab.find( "tr" ).find( "th:nth-child(4),td:nth-child(4)" ).hide();

        var links = secondColumn.next().addBack().next().addBack().find( "code" ).not( function()
        {
            return $( this ).text() == "-";
        } );

        links.css( "cursor", "pointer" ).css( "text-decoration", "underline" );
        links.click( _jumpToTable );

        TableDecorator.freezeHeader( tab.find( "table" ) );
    };

    /*-----------------------------------------------------------------------*/

    var _addTabs = function( scope, coveritem )
    {
        // Can be invoked when all tabs are loaded or when only summary is loaded

        var tabName = Report._makeTabName( "machine", scope );

        if ( tabName in Report.idByName == false )
        {
            // Remove all tabs except tab with summary
            while ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length - 1 )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(1)" ) );

            var tabId = Report._makeTabId();
            var instanceName = Report._extractNameFromNode( $( "#" + scope ) );

            Report._addTab( tabId, "FSM - " + instanceName );
            Report.idByName[ tabName ] = tabId;
            Report.nameById[ tabId ] = tabName;

            // Build cache by the way
            _addTable( $( "#" + tabId ), Report.cvg_data[ scope ].machine );

            $.each( _lines, function( path, lines )
            {
                var tabName = Report._makeTabName( "machine", scope, path );
                var tabId = Report._makeTabId();
                var tabTitle = path || "No data";

                Report._addTab( tabId, "FSM - " + tabTitle );
                Report.idByName[ tabName ] = tabId;
                Report.nameById[ tabId ] = tabName;

                _addCode( $( "#" + tabId ), lines, path );
            } );

            // Clear cache
            _lines = {};
        }

        if ( typeof coveritem != "undefined" )
        {
            Report._selectTab( Report.idByName[ tabName ] );
            Report._scrollToItem( coveritem );
        }
    };

    /*-----------------------------------------------------------------------*/

    var _publicInterface =
    {
        addTabs: _addTabs
    };

    return _publicInterface;
}();
