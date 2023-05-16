var RankingLoader = function()
{
    var _jumpToRankingTest = function()
    {
        var cell = $( this ).parent();
        var row = cell.parent();
        var table = row.closest( "table" );
        var root = table.find( ".toggle-opened" ).add( table.find( ".toggle-closed" ) ).closest( "tr" );
        var group = root.filter( row.prevAll() ).last().attr( "id" ).substr( 4 );
        
        $( "#accord-tree-ranking" ).jstree( "open_node", "#ranking-0" );
        $( "#accord-tree-ranking" ).jstree( "open_node", "#" + group );
        $( "#ranking-" + row.find( "td" ).first().text() ).children( "a" ).click();
        Report.ui.content.tabs( "option", "active", cell.nextAll().length > 1 ? 0 : 1 );
    };
    
    /*-----------------------------------------------------------------------*/

    var _loadRankingSummary = function( leftTabNumber, rightTabNumber )
    {
        var mode = ( Report.cvg_data.ranking.options.Cost || "" ).slice( 1 );
        mode = mode.charAt( 0 ).toUpperCase() + mode.slice( 1 );
        
        var table = "<p>RANKING RESULTS</p>";
        table += "<table class='border ranking'><tr>";
        table += "<th>Id</th>";
        table += "<th>Cumulative<br>Coverage</th>";
        table += "<th>Test<br>Coverage</th>";
        table += "<th>Coverage<br>Increment</th>";
        table += "<th>Contributing<br>Items</th>";
        table += "<th>" + mode + "</th>";
        table += "<th>Test Name</th>";
        table += "</tr>";
        
        $( Report.tree_data.ranking.children ).each( function()
        {
            table += "<tr id='rel-" + this.id + "'>";
            table += "<td style='padding-left: 4px' colspan='7'>";
            table += this.text.trim();
            table += "</td>";
            table += "</tr>";
            
            $( this.children ).each( function()
            {
                var id = this.id;
                var result = Report.cvg_data.ranking[ id ].summary[ 0 ]; // Cumulative Coverage
                
                table += "<tr>";
                table += "<td style='padding-left: 22px'>" + id.split( "-" )[ 1 ] + "</td>";
                table += "<td><span>" + result[ 1 ] + "</span></td>";
                table += "<td><span>" + result[ 2 ] + "</span></td>";
                table += "<td><span>" + result[ 3 ] + "</span></td>";
                table += "<td><span>" + result[ 4 ] + "</span></td>";
                table += "<td><span>" + ( Report.cvg_data.ranking[ id ].cost || "" ) + "</span></td>";
                table += "<td><span>" + Report.cvg_data.ranking[ id ].name + "</span></td>";
                table += "</tr>";
            } );
        } );
        
        table += "</table>";
        Report._addTab( leftTabNumber, "Ranking - Cumulative Summary" );
        $( "#" + leftTabNumber ).html( table );
        
        var links = $( "#" + leftTabNumber ).find( "span" );
        links.click( _jumpToRankingTest );
        links.css( "cursor", "pointer" );
        links.css( "text-decoration", "underline" );
        
        TableDecorator.addHighlighting( $( "#" + leftTabNumber ).find( "table" ) );
        TableDecorator.addExpanding( $( "#" + leftTabNumber ).find( "table" ) );
        TableDecorator.loadView( "ranking-0-left", $( "#" + leftTabNumber ).find( "table" ) );
        
        if ( mode == "" )
        {
            $( "#" + leftTabNumber ).find( "th:nth-child( 6 )" ).css( "display", "none" );
            $( "#" + leftTabNumber ).find( "td:nth-child( 6 )" ).css( "display", "none" );
        }
        
        table = "<p>RANKING OPTIONS</p>";
        table += "<table class='border'><tr>";
        table += "<th>Property</th>";
        table += "<th>Value</th>";
        table += "</tr>";
        
        $.each( Report.cvg_data.ranking.options, function( name, value )
        {
            table += "<tr>";
            table += "<td>" + name + "</td>";
            table += "<td>" + value + "</td>";
            table += "</tr>";
        } );
        
        table += "</table>";
        Report._addTab( rightTabNumber, "Ranking - Options" );
        $( "#" + rightTabNumber ).html( table );
        TableDecorator.addHighlighting( $( "#" + rightTabNumber ).find( "table" ) );
    };
    
    /*-----------------------------------------------------------------------*/

    var _loadRankingTest = function( leftTabNumber, rightTabNumber )
    {
        var id = Report.nameById[ leftTabNumber ].split( "-" ).slice( 0, -1 ).join( "-" );
        var name = $( "#" + id ).find( "a" ).text().trim();
        
        var table = "<table class='border ranking'><tr>";
        table += "<th>Coverage Type</th>";
        table += "<th>Cumulative<br>Coverage</th>";
        table += "<th>Test<br>Coverage</th>";
        table += "<th>Coverage<br>Increment</th>";
        table += "<th>Contributing<br>Items</th>";
        table += "</tr>";
        
        $.each( Report.cvg_data.ranking[ id ].summary, function( index, value )
        {
            table += "<tr>";
            table += "<td>" + value[ 0 ] + "</td>";
            table += "<td>" + value[ 1 ] + "</td>";
            table += "<td>" + value[ 2 ] + "</td>";
            table += "<td>" + value[ 3 ] + "</td>";
            table += "<td>" + value[ 4 ] + "</td>";
            table += "</tr>";
        } );
        
        table += "</table>";
        Report._addTab( leftTabNumber, "Test Ranking - " + name );
        $( "#" + leftTabNumber ).html( table );
        TableDecorator.addHighlighting( $( "#" + leftTabNumber ).find( "table" ) );
        
        table = "<table class='border'><tr>";
        table += "<th>Property</th>";
        table += "<th>Value</th>";
        table += "</tr>";
        
        $.each( Report.cvg_data.ranking[ id ].info, function( index, value )
        {
            var hue = "gray";
            hue = value.Status == "Error" || value.Status == "Fatal" ? "red" : hue;
            hue = value.Status == "Warning" ? "yellow" : hue;
            hue = value.Status == "Ok" ? "green" : hue;
            hue = " class='" + hue + "'";
        
            $.each( value, function( name, value )
            {
                table += "<tr" + hue + ">";
                table += "<td style='padding-left: " + ( hue ? 4 : 22 ) + "px'>" + name + "</td>";
                table += "<td>" + value + "</td>"
                table += "</tr>";
                hue = "";
            } );
        } );
        
        table += "</table>";
        Report._addTab( rightTabNumber, "Test Details - " + name );
        $( "#" + rightTabNumber ).html( table );
        TableDecorator.addHighlighting( $( "#" + rightTabNumber ).find( "table" ) );
        TableDecorator.addExpanding( $( "#" + rightTabNumber ).find( "table" ), true );
        TableDecorator.loadView( id + "-right", $( "#" + rightTabNumber ).find( "table" ) );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _loadRankingTabs = function()
    {
        $( ".tree-view" ).not( this ).jstree( "deselect_all" );
        
        var id = $( this ).jstree( "get_selected" )[ 0 ];
        var isGroup = isNaN( parseInt( id.charAt( 8 ) ) );
        var leftTabName = ( isGroup ? "ranking-0" : id ) + "-left";
        var rightTabName = ( isGroup ? "ranking-0" : id ) + "-right";
        var activeTab = Report.ui.content.tabs( "option", "active" );
        
        if ( leftTabName in Report.idByName && rightTabName in Report.idByName )
        {
            Report.ui.content.tabs( "option", "active", 1 - activeTab );
            $( "#content" ).find( ".ui-tabs-panel" ).scrollTop( 0 );
            
            if ( isGroup )
                Report._scrollToItem( id );
            
            Report.ui.content.tabs( "option", "active", activeTab );
            $( "#content" ).find( ".ui-tabs-panel" ).scrollTop( 0 );
            
            if ( isGroup )
                Report._scrollToItem( id );
        
            return;
        }
        
        Report._saveView();
            
        // Remove all tabs
        while ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length )
            Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(0)" ) );
        
        var leftTabNumber = Report._makeTabId();
        Report.idByName[ leftTabName ] = leftTabNumber;
        Report.nameById[ leftTabNumber ] = leftTabName;
        
        var rightTabNumber = Report._makeTabId();
        Report.idByName[ rightTabName ] = rightTabNumber;
        Report.nameById[ rightTabNumber ] = rightTabName;
        
        if ( isGroup || id == "ranking-0" )
            _loadRankingSummary( leftTabNumber, rightTabNumber );
        else
            _loadRankingTest( leftTabNumber, rightTabNumber );
        
        if ( isGroup )
            Report._scrollToItem( id );
        
        activeTab = Math.min( activeTab, $( "#content .ui-tabs-nav > li" ).length - 1 );
        Report.ui.content.tabs( "option", "active", activeTab );
    };
    
    /*-----------------------------------------------------------------------*/

    var _loadTree = function()
    {
        var options = $.extend( {}, Report.BASIC_TREE_OPTIONS );
        options.core.data = Report.tree_data.ranking;
        $.extend( options.core.data, { state: { opened: true } } );
        options.core.worker = false;
        $( "#accord-tree-ranking" ).bind( "redraw.jstree open_node.jstree", Report._removeLocation );
        $( "#accord-tree-ranking" ).jstree( options ).bind( "select_node.jstree", _loadRankingTabs );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _selectRoot = function()
    {
        var tree = $( "#accord-tree-ranking" );
        
        // Select root without animation
        var state = tree.jstree( "get_state" );
        state.core.selected = [ "ranking-0" ];
        tree.jstree( "set_state", state );
        
        _loadRankingTabs.call( tree );
        
        // Deselect root without animation
        state = tree.jstree( "get_state" );
        state.core.selected = [];
        tree.jstree( "set_state", state );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _publicInterface =
    {
        loadTree: _loadTree,
        selectRoot: _selectRoot
    };

    return _publicInterface;
}();
