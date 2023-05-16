var PathLoader = function()
{
    var _fillTab = function( tab, coverage )
    {
        if ( !coverage )
        {
            tab.html( "No coverage data available for selected node." );
            return;
        }
        
        var content = "<table class='border path-table'>";
        content += "<tr><th>Label</th><th>Hits</th><th>Value</th><th>Line</th><th>Source</th></tr>";
        
        $.each( coverage, function( index, object )
        {
            var scope = object.line != undefined;
            var path = object.branch != undefined;
            var excluded = object.hits.charAt( 0 ) == "(";
            
            var covered = object.hits.indexOf( object.hits.split( "/" )[ 1 ] ) == 0;
            covered = path ? object.hits != "0" : covered;
            
            var hue = excluded ? "gray" : ( covered ? "green" : "red" );
            hue = " class='" + hue + "'";
            
            var padding = scope ? 4 : ( path ? 40 : 22 );
            padding = " style='padding-left:" + padding + "px'";
            
            var lineAndSource = ( object.line || "-:-" ).split( ":" );
            var line = lineAndSource.pop();
            var source = lineAndSource.join( ":" );
            
            content += "<tr id='rel-" + object.rel + "'" + hue + ">";
            content += "<td" + padding + ">" + Tools.escapeHTML( object.name ) + "</td>";
            content += "<td>" + object.hits + "</td>";
            content += "<td class='hyphen'>-</td>";
            content += "<td" + ( line == "-" ? " class='hyphen'" : "" ) + ">" + line + "</td>";
            content += "<td" + ( source == "-" ? " class='hyphen'" : "" ) + ">" + source + "</td>";
            content += "</tr>";
            
            $.each( object.branch || [], function( index, object )
            {
                var value = object.path == "T" ? "True" : ( object.path == "F" ? "False" : object.path );
                
                var lineAndSource = object.line.split( ":" );
                lineAndSource = [ lineAndSource.slice( 0, -1 ).join( ":" ), lineAndSource.slice( -1 ) ];
                
                var source = Report.sources[ lineAndSource[ 0 ] ] || "";
                source = source.split( "\n" )[ lineAndSource[ 1 ] - 1 ] || "";
                source = "<code>" + source + "</code>";
                
                content += "<tr>";
                content += "<td style='padding-left:58px'></td>";
                content += "<td></td>";
                content += "<td>" + value + "</td>";
                content += "<td>" + lineAndSource[ 1 ] + "</td>";
                content += "<td>" + source + "</td>";
                content += "</tr>";
            } );
        } );
        
        content += "</table>";
        tab.html( content );
        
        TableDecorator.addHighlighting( tab.find( ".path-table" ) );
        TableDecorator.addExpanding( tab.find( ".path-table" ) );
        TableDecorator.loadView( Report.nameById[ tab.attr( "id" ) ], tab.find( ".path-table" ) );
        
        tab.find( ".toggle-static" ).parent().parent().next().find( "td" ).css( "border-top-width", 0 );
        
        var leavesIcons = tab.find( ".toggle-static,.toggle-static-last" );
        var leavesRows = leavesIcons.parent().parent();
        var leavesCells = leavesIcons.parent().nextAll().andSelf();
        
        leavesCells.css( "padding-top", 2 );
        leavesCells.css( "padding-bottom", 2 );
        leavesIcons.css( "opacity", 0 ); // Expandable table can be recognized only by those icons
        
        if ( CounterManager.isActive() )
            CounterManager.takeOver( leavesRows.prev().not( leavesRows ).find( "span" ).parent().next() );
    };
    
    /*-----------------------------------------------------------------------*/

    var _addTab = function( scope, coveritem, activate )
    {
        var tabId;
        var tabName = Report._makeTabName( "path", scope );
        
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
            var isSummaryOpened = Report._makeTabName( "summary", scope ) in Report.idByName;
            while ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length - isSummaryOpened ? 1 : 0 )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(" + ( isSummaryOpened ? 1 : 0 ) + ")" ) );
            
            // Add tab with details and fill it
            var inst_name = Report._extractNameFromNode( $( "#" + scope ) );
            Report._addTab( tabId, "Path - " + inst_name );
            _fillTab( $( "#" + tabId ), Report.cvg_data[ scope ].path );
            
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
