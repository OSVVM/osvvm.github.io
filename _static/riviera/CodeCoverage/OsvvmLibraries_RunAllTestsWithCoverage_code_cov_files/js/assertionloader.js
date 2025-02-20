var AssertionLoader = function()
{
    var _showAssertionCoverage = function( tabId, cvg_data )
    {
        if ( !cvg_data )
        {
            $( "#" + tabId ).html( "No coverage data available for selected node." );
            return;
        }
        
        var assertions = "";
        var covers = "";
        
        $.each( cvg_data, function( index, value )
        {
            var count = index.charAt( 0 ) == "a" ? 11 : 5;
            var cells = value.split( "|" );
            
            // Support for extended identifiers
            if ( cells.length > count )
            {
                var name = cells.slice( 0, cells.length - count + 1 ).join( "|" );
                cells.splice( 0, cells.length - count + 1, name );
            }
            
            var status = cells.pop();
            var anchor = "rel-" + index;
            
            var row = "<tr class='assertion-" + status + "' id='" + anchor + "'>";
            row += "<td>" + cells.join( "</td><td>" ) + "</td>";
            row += "</tr>";
            
            if ( index.charAt( 0 ) == "a" )
                assertions += row;
            else
                covers += row;
        } );
        
        var content = "";
        
        if ( assertions )
        {
            content += "<p>ASSERTION COVERAGE</p>";
            content += "<table class='border assertion-table'><tr id='rel-assertion-0'>";
            content += "<th>Name</th><th>Source</th><th>Type</th>";
            content += "<th>Failed</th><th>Passed</th><th>Vacuously Passed</th>";
            content += "<th>Disabled</th><th>Attempted</th><th>Active</th><th>Active Peak</th>";
            content += "</tr>" + assertions + "</table>";
        }
        
        if ( covers )
        {
            content += "<p>COVER COVERAGE</p>";
            content += "<table class='border assertion-table'><tr id='rel-cover-0'>";
            content += "<th>Name</th><th>Source</th><th>Type</th><th>Hits</th>";
            content += "</tr>" + covers + "</table>";
        }
        
        $( "#" + tabId ).html( content );
        
        if ( Report.cvg_data.summary.options.assertiontype == 0 )
        {
            $( "#" + tabId ).find( "th:nth-child(3)" ).css( "display", "none" );
            $( "#" + tabId ).find( "td:nth-child(3)" ).css( "display", "none" );
        }
        
        if ( Report.cvg_data.summary.options.assertiondebug == 0 )
        {
            $( "#" + tabId ).find( "th:nth-child(n+6)" ).css( "display", "none" );
            $( "#" + tabId ).find( "td:nth-child(n+6)" ).css( "display", "none" );
        }
        
        if ( CounterManager.isActive() )
            CounterManager.takeOver( $( "#" + tabId ).find( "td:nth-child(n+4)" ) );
    };
    
    /*-----------------------------------------------------------------------*/

    var _addTab = function( scope, coveritem, activate )
    {
        var tabId;
        var tabName = Report._makeTabName( "assertion", scope );
        
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
            Report._addTab( tabId, "Assertion - " + inst_name );
            _showAssertionCoverage( tabId, Report.cvg_data[ scope ].assertion );
            
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
