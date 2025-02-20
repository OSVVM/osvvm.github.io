var ExpressionLoader = function()
{
    var _filePrefix = "Source: ";

    /*-----------------------------------------------------------------------*/

    var _generateCommonExpressionTable = function( table, data )
    {
        var operator = "<td class='operator' rowspan='" + ( data.length - 1 ) + "'>" + data[ 0 ] + "</td>";
        
        table.append( "<tbody>" );
        
        $.each( data, function( index, value )
        {
            if ( index )
            {
                var columns = value.split( "|" );
                var row = "<tr>" + operator;
                operator = "";
                $.each( columns, function( index, value )
                {
                    row += "<td>" + value + "</td>";
                } );
                row += "</tr>";
                table.append( row );
            }
        } );
        
        table.append( "</tbody>" );
    };

    /*-----------------------------------------------------------------------*/

    var _fixVectorTableWidth = function()
    {
        if ( $( "#brackets" ).length )
            return;

        var table = $( "<table class='border details simplevector'></table>" );
        table.css( "position", "absolute" );
        table.css( "visibility", "hidden" );
        table.css( "display", "block" );
        table.appendTo( "body" );
        table.append( "<tr><td>(Y)</td></tr>" );
        table.append( "<tr><td>(N)</td></tr>" );
        table.append( "<tr><td>C</td></tr>" );

        var style = "<style id='brackets' type='text/css'>";
        style += ".brackets .rightside { min-width:" + table.find( "td" ).first().width() + "px; }";
        style += "</style>";
        $( style ).appendTo( "head" );

        table.remove();
    };

    /*-----------------------------------------------------------------------*/

    var _generateSimpleVectorTable = function( table, data )
    {
        _fixVectorTableWidth();

        var subExpressionCount = ( data[ 1 ].match( /</g ) || [] ).length;
        var operator = "<td class='operator' rowspan='" + ( data.length - 1 ) + "'>" + data[ 0 ] + "</td>";
        
        table.append( "<tbody>" );
        
        $.each( data, function( index, value )
        {
            if ( index )
            {
                if ( value.split( "(" ).length != 1 )
                    table.addClass( "brackets" );
                
                var row = "<tr>" + operator;
                operator = ""; // Add operator only once

                var columns = value.split( "|" );
                $.each( columns, function( index, value )
                {
                    var rowClass = index < subExpressionCount ? "leftside" : "rightside";

                    if ( index == 0 || index == subExpressionCount )
                        rowClass += " firstcolumn";
                    if ( index == subExpressionCount - 1 || index == columns.length - 1 )
                        rowClass += " lastcolumn";

                    row += "<td class='" + rowClass + "'>" + value + "</td>";
                } );

                row += "</tr>";
                table.append( row );
            }
        } );
        
        table.append( "</tbody>" );
    };

    /*-----------------------------------------------------------------------*/

    var _jumpToCode = function()
    {
        var span = $( this );
        var table = span.closest( "table" );
        var tabName = Report.nameById[ table.parent().parent().attr( "id" ) ];

        tabName = Report._makeTabName(
            tabName.split( "::" )[ 0 ],
            "file",
            table.find( "th.filename" ).text().slice( _filePrefix.length ) );

        Report._scrollToLine( Report.idByName[ tabName ], span.text() );
    };

    /*-----------------------------------------------------------------------*/

    var _addTables = function( tabId, cvg_data )
    {
        if ( !cvg_data )
        {
            $( "#" + tabId ).html( "No coverage data available for selected node." );
            return;
        }
        
        $( "#" + tabId ).html( "<div id='expression-table-container'></div>" );
            
        $.each( cvg_data, function( index, value )
        {
            var tableForFile = $( "#template-exc > table" ).clone();
            tableForFile.find( ".filename" ).text( _filePrefix + index );
            $( "#expression-table-container" ).append( tableForFile );
            $( "#expression-table-container" ).append( "<br>" );
            
            var tableForDetails = $();

            $.each( value, function( index, value )
            {
                var id = value.rel ? " id='rel-" + value.rel + "'" : "";
                
                if ( value.line )
                {
                    // Generate summary for top expression
                    var summary = "<tr class='exc-" + value.status + "'" + id + ">";
                    summary += "<td><a>" + value.line + "</a></td>";
                    summary += "<td>" + value.hits + "</td><td>";
                    summary += value.path + ": ";
                    summary += value.name + "</td></tr>";
                    tableForFile.append( summary );
                    
                    // Generate row for details and remember where to place them
                    var details = $( "<tr><td></td><td></td><td><table class='details'></table></td></tr>" );
                    tableForDetails = details.find( "table" );
                    tableForFile.append( details );
                }

                else if ( value.path )
                {
                    var summary = "<tr><td><span" + id + ">";
                    summary += value.path + ": ";
                    summary += value.name + "</span></td></tr>";
                    tableForDetails.append( summary );
                }
                
                if ( value.legend )
                {
                    var legend = $( "<tr><td><table class='legend'></table></td></tr>" );
                    var bins = $( "<tr><td><table></table></td></tr>" );

                    tableForDetails.append( legend );
                    tableForDetails.append( bins );

                    var tableForLegend = legend.find( "table" );
                    var tableForBins = bins.find( "table" );
                    
                    $.each( value.legend, function( index, value )
                    {
                        tableForLegend.append( "<tr><td>&lt;" + ( index + 1 ) + "&gt; - " + value + "</td></tr>" );
                    } );
                    
                    if ( value.bins[ 1 ].indexOf( "Hits" ) == 0 )
                    {
                        tableForBins.addClass( "bins" );
                        _generateCommonExpressionTable( tableForBins, value.bins );
                    }
                    else
                    {
                        tableForBins.addClass( "simplevector" );
                        _generateSimpleVectorTable( tableForBins, value.bins );
                    }
                    
                    Tools.makeColorExplicit( tableForBins.find( "tr" ).first() );
                    TableDecorator.addHighlighting( tableForBins );
                }
            } );
        } );
        
        var tables = $( "#expression-table-container" );
        tables.children().slice( -1 ).remove();
        
        if ( CounterManager.isActive() )
        {
            var counters = tables.find( ".bins" ).find( "td:first-child" ).not( ".operator" );
            CounterManager.takeOver( counters );
        }

        var links = tables.find( "a" );
        links.css( "cursor", "pointer" ).css( "text-decoration", "underline" );
        links.click( _jumpToCode );
    };

    /*-----------------------------------------------------------------------*/

    var _mergeStatus = function( left, right )
    {
        if ( left == "low" || right == "low" || left == "uncovered" || right == "uncovered" )
            return "uncovered";

        if ( left == "high" || right == "high" || left == "covered" || right == "covered" )
            return "covered";

        return "excluded";
    };

    /*-----------------------------------------------------------------------*/

    var _jumpToTable = function()
    {
        var code = $( this );
        var div = code.parent();
        var path = div.closest( "table" ).find( "tr" ).first().find( "th" ).last().text();
        var line = div.prevAll().length + 1;
        var index = code.prevAll( "code" ).length;

        Report.ui.content.tabs( "option", "active", 1 );

        $( ".filename" ).each( function()
        {
            var th = $( this );

            if ( th.text() != path )
                return true;

            for ( var tr = th.parent().next(); tr.length; tr = tr.next() )
            {
                if ( tr.find( "td" ).first().text() != line )
                    continue;

                if ( index == 0 )
                {
                    Tools.scrollTo( tr );
                    return false;
                }

                --index;
            }
        } );
    };

    /*-----------------------------------------------------------------------*/

    var _addTabsWithCode = function( namePrefix, titlePrefix, coverage )
    {
        $.each( coverage || {}, function( file, rows )
        {
            var tabId = Report._makeTabId();
            var tabName = Report._makeTabName( namePrefix, "file", file );

            Report._addTab( tabId, titlePrefix + file );
            Report.idByName[ tabName ] = tabId;
            Report.nameById[ tabId ] = tabName;

            var lines = {};

            $.each( rows, function( index, row )
            {
                if ( typeof row.line == "undefined" )
                    return true;

                if ( typeof lines[ row.line ] == "undefined" )
                    lines[ row.line ] = { hits: [], status: "excluded" };

                var line = lines[ row.line ];
                line.hits.push( row.hits );
                line.status = _mergeStatus( line.status, row.status );
            } );
            
            Report._showCodeCoverage( tabId, lines, file );

            var tab = $( "#" + tabId );

            var links = tab.find( ".gutter+.gutter code" );
            links.css( "cursor", "pointer" ).css( "text-decoration", "underline" );
            links.click( _jumpToTable );

            TableDecorator.freezeHeader( tab.find( "table" ) );
        } );
    };
    
    /*-----------------------------------------------------------------------*/

    var _addExpressionTab = function( scope, coveritem, active )
    {
        var tabId;
        var tabName = Report._makeTabName( "exc", scope );
        
        if ( tabName in Report.idByName )
        {
            if ( active )
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
            
            var cvg_data = Report.cvg_data[ scope ].exc;
            var prefix = "Expression - ";
            var inst_name = Report._extractNameFromNode( $( "#" + scope ) );
            
            // Remove all tabs except tab with summary
            while ( Report.ui.content.find( ".ui-tabs-nav li" ).length - 1 )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(1)" ) );

            Report._addTab( tabId, prefix + inst_name );
            _addTables( tabId, cvg_data );

            _addTabsWithCode( "exc", prefix, cvg_data );

            if ( active )
            {
                Report._selectTab( tabId );
                Report._scrollToItem( coveritem );
            }
        }
    };

    /*-----------------------------------------------------------------------*/

    var _addConditionTab = function( scope, coveritem, active )
    {
        var tabId;
        var tabName = Report._makeTabName( "cec", scope );
        
        if ( tabName in Report.idByName )
        {
            if ( active )
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
            
            var cvg_data = Report.cvg_data[ scope ].cec;
            var prefix = "Condition - ";
            var inst_name = Report._extractNameFromNode( $( "#" + scope ) );
            
            // Remove all tabs except tab with summary
            while ( Report.ui.content.find( ".ui-tabs-nav li" ).length - 1 )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(1)" ) );
            
            Report._addTab( tabId, prefix + inst_name );
            _addTables( tabId, cvg_data );

            _addTabsWithCode( "cec", prefix, cvg_data );
            
            if ( active )
            {
                Report._selectTab( tabId );
                Report._scrollToItem( coveritem );
            }
        }
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _publicInterface =
    {
        addExpressionTab: _addExpressionTab,
        addConditionTab: _addConditionTab
    };

    return _publicInterface;
}();
