var ToggleLoader = function()
{
    var _typeExported;

    /*-----------------------------------------------------------------------*/

    var _splitAtHits = function( header )
    {
        var result = [ "" ];
        var even = false;

        header.split( "\\" ).forEach( function( element )
        {
            even = !even;

            if ( even )
            {
                var first = true;

                element.split( "/" ).forEach( function( element )
                {
                    if ( !first )
                        result = result.concat( [ "" ] );
                    else
                        first = false;
                    
                    result[ result.length - 1 ] += element;
                } );
            }
            else
            {
                result[ result.length - 1 ] += "\\";
                result[ result.length - 1 ] += element;
                result[ result.length - 1 ] += "\\";
            }
        } );

        return result;
    };

    /*-----------------------------------------------------------------------*/

    var _generateToggleGroup = function( exported, width, object, level )
    {
        var content = "";
        var first = true;
        
        $.each( object, function( header, group )
        {
            if ( !first )
                content += "</tr><tr style='display:none'>";
            else
                first = false;
            
            var cells = header.split( "|" );
            var padding = " style='padding-left:" + ( 4 + 18 * ( level - 1 ) ) + "px'";
            
            // Support for extended identifiers
            if ( cells.length > exported )
            {
                var splittedAtHits = _splitAtHits( header );

                if ( _typeExported )
                {
                    var typeCells = splittedAtHits.pop().split( "|" ).length - 2;
                    cells.splice( -typeCells, typeCells, cells.slice( -typeCells ).join( "|" ) );
                }

                var nameCells = splittedAtHits.reverse().pop().split( "|" ).length - 1;
                cells.splice( 0, nameCells, cells.slice( 0, nameCells ).join( "|" ) );
            }
            
            $.each( cells, function process( index, cell )
            {
                cell = Tools.escapeHTML( cell );

                if ( cell == "" )
                    cell = "-";

                if ( index == cells.length - 1 - _typeExported )
                {
                    for ( var v = 0; v < width - exported; ++v )
                        process( index - 1, "0/0" );

                    var color = cell == "Y" ? "high" : ( cell == "N" ? "low" : "excluded" );
                    content += "<td class='toggle-" + color + "'>";
                    content += cell == "Y" ? "Yes" : ( cell == "N" ? "No" : "Excluded" );
                    content += "</td>";
                }
                else
                {
                    content += "<td";
                    content += index == 0 ? padding : "";
                    content += cell == "-" ? " class='hyphen'>" : ">";
                    content += cell;
                    content += "</td>";
                }
            } );
            
            content += "</tr>";
            
            if ( $.isArray( group ) )
            {
                $.each( group, function( rowIndex, row )
                {
                    content += "<tr style='display:none'>";

                    var cells = row.split( "|" );
                    var padding = " style='padding-left:" + ( 4 + 18 * level ) + "px'";
                    
                    // Support for extended identifiers
                    if ( cells.length > exported )
                    {
                        var name = cells.slice( 0, cells.length - exported + 1 ).join( "|" );
                        cells.splice( 0, cells.length - exported + 1, name );
                    }
                    
                    $.each( cells, function process( cellIndex, cell )
                    {
                        cell = Tools.escapeHTML( cell );

                        if ( cell == "" )
                            cell = "-";

                        if ( cellIndex == cells.length - 1 - _typeExported )
                        {
                            for ( var v = 0; v < width - exported; ++v )
                                process( cellIndex - 1, "-" );

                            cell = cell == "Y" ? "Yes" : ( cell == "N" ? "No" : "Excluded" );
                        }
                        
                        content += "<td";
                        content += cellIndex == 0 ? padding : "";
                        content += cell == "-" ? " class='hyphen'>" : ">";
                        content += cell;
                        content += "</td>";
                    } );
                    
                    content += "</tr>";
                } );
            }
            else
            {
                content += "<tr style='display:none'>";
                content += _generateToggleGroup( exported, width, group, level + 1 );
            }
        } );
        
        return content;
    };

    /*-----------------------------------------------------------------------*/

    var _showToggleCoverage = function( tabId, cvg_data )
    {
        var tab = $( "#" + tabId );

        if ( !cvg_data )
        {
            tab.html( "No coverage data available for selected node." );
            return;
        }

        $.each( cvg_data, function( index, value )
        {
            if ( typeof _typeExported != "undefined" )
                return false;

            if ( index == "legend" )
                return true;

            $.each( value, function( header, rows )
            {
                _typeExported = _splitAtHits( header ).pop().split( "|" ).length > 2;
                return false;
            } );
        } );
        
        var content = "<table class='border toggle-table'><tr><th>Name</th>";
        var transitions = ( cvg_data.legend || "0->1|1->0" ).split( "|" );
        var short = true; // If true then next signal has only two main transitions

        $.each( transitions, function( index, value )
        {
            content += "<th>";
            content += value;
            content += "</th>";
        } );

        content += "<th>Toggled</th>";
        content += _typeExported ? "<th>Type</th>" : "";
        content += "</tr>";
        
        $.each( cvg_data, function( index, value )
        {
            if ( index == "legend" )
            {
                short = false;
                return true;
            }

            content += "<tr id='rel-" + index + "'>";

            content += _generateToggleGroup(
                ( short ? 4 : transitions.length + 2 ) + _typeExported,
                transitions.length + 2 + _typeExported,
                value,
                1 );
        } );
        
        content += "</table>";
        tab.html( content );
        
        // Expanding color from the last cell to the whole row        
        tab.find( "td.toggle-high" ).removeClass( "toggle-high" ).parent().addClass( "toggle-high" );
        tab.find( "td.toggle-low" ).removeClass( "toggle-low" ).parent().addClass( "toggle-low" );
        tab.find( "td.toggle-excluded" ).removeClass( "toggle-excluded" ).parent().addClass( "toggle-excluded" );

        tab.find( "td:nth-last-child(" + ( _typeExported ? 2 : 1 ) + ")" ).addClass( "toggle-status" );
        
        TableDecorator.addHighlighting( tab.children( "table" ) );
        TableDecorator.addExpanding( tab.children( "table" ) );
        TableDecorator.loadView( Report.nameById[ tabId ], tab.children( "table" ) );
        
        if ( CounterManager.isActive() )
        {
            // Adding tooltips
            var counters = tab.find( ".toggle-static,.toggle-static-last" ).parent().next().nextAll().prev();
            CounterManager.takeOver( counters );
        }
    };
    
    /*-----------------------------------------------------------------------*/

    var _addTab = function( scope, coveritem, activate )
    {
        var tabId;
        var tabName = Report._makeTabName( "toggle", scope );
        
        if ( tabName in Report.idByName )
        {
            if ( activate )
            {
                tabId = Report.idByName[ tabName ];
                Report._selectTab( tabId );
                Report._scrollToItem( coveritem );
            }
        }
        else
        {
            tabId = Report._makeTabId();
            Report.idByName[ tabName ] = tabId;
            Report.nameById[ tabId ] = tabName;
            
            // Remove all tabs except tab with summary
            while ( Report.ui.content.find( ".ui-tabs-nav li" ).length - 1 )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(1)" ) );
            
            // Add tab with details and fill it
            var inst_name = Report._extractNameFromNode( $( "#" + scope ) );
            Report._addTab( tabId, "Toggle - " + inst_name );
            _showToggleCoverage( tabId, Report.cvg_data[ scope ].toggle );
            
            if ( activate )
            {
                Report._selectTab( tabId );
                Report._scrollToItem( coveritem );
            }
        }
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _publicInterface =
    {
        addTab: _addTab
    };

    return _publicInterface;
}();
