var PlanLoader = function()
{
    var _buildHueMap = function( tree )
    {
        var map = {};
        map[ tree.id ] = tree.a_attr.class;
        
        if ( tree.children )
            $.each( tree.children, function( index, tree )
            {
                $.extend( map, _buildHueMap( tree ) );
            } );
            
        return map;
    };
    
    /*-----------------------------------------------------------------------*/

    var _chooseTestplanSection = function()
    {
        var id = $( this ).parent().parent().attr( "id" ).split( "-" ).slice( 1 ).join( "-" );
        
        if ( id == "testplan-0" )
            return;
        
        var tree = $( "#accord-tree-testplan" );
        tree.jstree( "open_node", "#testplan-0" );
        
        var depth = id.split( "-" ).length;
        for ( var i = 1; i < depth - 1; ++i )
            tree.jstree( "open_node", "#" + id.split( "-" ).slice( 0, i + 1 ).join( "-" ) );
        
        $( "#" + id ).children( "a" ).click();
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _loadTestplanCumulativeSummary = function()
    {
        var selectedSection = $( this ).jstree( "get_selected" )[ 0 ];
        var leftTabName = selectedSection + "-left";
        var leftTabNumber = Report.idByName[ leftTabName ];
        var hueMap = _buildHueMap( Report.tree_data.testplan );
        
        if ( !Report.cvg_data.testplan[ "testplan-0" ] )
        {
            $( "#" + leftTabNumber ).html( "No data to display." );
            return;
        }
        
        var summary = "";
        summary += "<p>CUMULATIVE SUMMARY</p>";
        summary += "<table class='border testplan-cumulative'>";
        summary += "<tr>";
        summary += "<th>Section</th>";
        summary += "<th>Local<br>Coverage</th>";
        summary += "<th>Local<br>Hits/Total</th>";
        summary += "<th>Local<br>Link Status</th>";
        summary += "<th>Recursive<br>Coverage</th>";
        summary += "<th>Recursive<br>Hits/Total</th>";
        summary += "<th>Recursive<br>Link Status</th>";
        summary += "<th>Recursive<br>Unimplemented</th>";
        summary += "<th>Weight</th>";
        summary += "<th>Goal</th>";
        summary += "</tr>";
        
        $.each( Report.cvg_data.testplan, function( sectionId, sectionData )
        {
            var local = sectionData.summary.local;
            var recursive = sectionData.summary.recursive || local;
            
            var hue = "";
            hue = hueMap[ sectionId ] == "jstree-low" ? "summary-uncovered" : hue;
            hue = hueMap[ sectionId ] == "jstree-high" ? "summary-covered" : hue;
            hue = hueMap[ sectionId ] == "jstree-excluded" ? "summary-excluded" : hue;
            
            var padding = 4 + 18 * ( sectionId.split( "-" ).length - 1 );
            padding = sectionId == "testplan-0" ? 4 : padding;
            
            var name = sectionData.name;
            name = sectionId == selectedSection ? name : "<span>" + name + "</span>";
            
            var hits = local.hits;
            hits = sectionData.summary.weight == 0 ? Tools.wrapNumbersInBrackets( hits ) : hits;
            
            summary += "<tr id='rel-" + sectionId + "' class='" + hue + "'>";
            summary += "<td style='padding-left: " + padding + "px'>" + name + "</td>";
            summary += "<td" + ( local.coverage == "-" ? " class='hyphen'" : "" ) + ">" + local.coverage + "</td>";
            summary += "<td" + ( local.hits == "-" ? " class='hyphen'" : "" ) + ">" + hits + "</td>";
            summary += "<td" + ( local.status == "-" ? " class='hyphen'" : "" ) + ">" + local.status + "</td>";
            
            hits = recursive.hits;
            hits = sectionData.summary.weight == 0 ? Tools.wrapNumbersInBrackets( hits ) : hits;
            
            summary += "<td>" + recursive.coverage + "</td>";
            summary += "<td>" + hits + "</td>";
            summary += "<td>" + recursive.status + "</td>";
            summary += "<td>" + ( sectionData.summary.extra || 0 ) + "</td>";
            summary += "<td>" + sectionData.summary.weight + "</td>";
            summary += "<td>" + sectionData.summary.goal + "</td>";
            summary += "</tr>";
        } );
        
        summary += "</table>";
        $( "#" + leftTabNumber ).html( summary );
        
        if ( !Report.cvg_data.testplan[ "testplan-0" ].summary.extra )
        {
            $( "#" + leftTabNumber ).find( "th:nth-child( 8 )" ).css( "display", "none" );
            $( "#" + leftTabNumber ).find( "td:nth-child( 8 )" ).css( "display", "none" );
        }
        
        var sectionNames = $( "#" + leftTabNumber ).find( "span" );
        sectionNames.css( "cursor", "pointer" );
        sectionNames.css( "text-decoration", "underline" );
        sectionNames.bind( "click", _chooseTestplanSection );
        
        TableDecorator.addExpanding( $( "#" + leftTabNumber ).children( "table" ) );
        TableDecorator.loadView( leftTabName, $( "#" + leftTabNumber ).children( "table" ) );
    };
    
    /*-----------------------------------------------------------------------*/

    var _loadTestplanSummary = function()
    {
        var selectedSection = $( this ).jstree( "get_selected" )[ 0 ];
        var leftTabName = selectedSection + "-left";
        var leftTabNumber = Report.idByName[ leftTabName ];
        var sectionData = Report.cvg_data.testplan[ selectedSection ];
        var hasChildren = !!sectionData.summary.recursive;
        
        var description = "";
        var summary = "";
        var user = "";
        
        if ( sectionData.description )
            description += "<p>DESCRIPTION</p><p>" + sectionData.description + "</p><br>";
        
        summary += "<p>SUMMARY</p>";
        summary += "<table class='border testplan-summary-" + ( hasChildren ? "long" : "short" ) + "'>";
        summary += "<tr>";
        summary += "<th>Local<br>Coverage</th>";
        summary += "<th>Local<br>Hits/Total</th>";
        summary += "<th>Local<br>Link Status</th>";
        
        if ( hasChildren )
        {
            summary += "<th>Recursive<br>Coverage</th>";
            summary += "<th>Recursive<br>Hits/Total</th>";
            summary += "<th>Recursive<br>Link Status</th>";
        }
        
        summary += "<th>Recursive<br>Unimplemented</th>";
        summary += "<th>Weight</th>";
        summary += "<th>Goal</th>";
        summary += "</tr>";
        
        var coverage = parseInt( sectionData.summary.local.coverage );
        var goal = sectionData.summary.goal;
        var hue = isNaN( coverage ) ? "excluded" : ( coverage >= goal ? "covered" : "uncovered" );
        
        var hits = sectionData.summary.local.hits;
        hits = sectionData.summary.weight == 0 ? Tools.wrapNumbersInBrackets( hits ) : hits;
        
        summary += "<tr class='summary-" + hue + "'>";
        summary += "<td>" + sectionData.summary.local.coverage + "</td>";
        summary += "<td>" + hits + "</td>";
        summary += "<td>" + sectionData.summary.local.status + "</td>";
        
        if ( hasChildren )
        {
            hits = sectionData.summary.recursive.hits;
            hits = sectionData.summary.weight == 0 ? Tools.wrapNumbersInBrackets( hits ) : hits;
            
            summary += "<td>" + sectionData.summary.recursive.coverage + "</td>";
            summary += "<td>" + hits + "</td>";
            summary += "<td>" + sectionData.summary.recursive.status + "</td>";
        }
        
        summary += "<td>" + ( sectionData.summary.extra || 0 ) + "</td>";
        summary += "<td>" + sectionData.summary.weight + "</td>";
        summary += "<td>" + sectionData.summary.goal + "</td>";
        summary += "</tr>";
        summary += "</table>";
        
        if ( sectionData.user )
        {
            user += "<br><p>USER ATTRIBUTES</p>";
            user += "<table class='border testplan-user'>";
            user += "<tr>";
            user += "<th>Key</th>";
            user += "<th>Value</th>";
            user += "</tr>";
            
            $.each( sectionData.user, function( left, right )
            {
                user += "<tr>";
                user += "<td>" + left.replace( /\n/g, "<br />" ) + "</td>";
                user += "<td>" + right.replace( /\n/g, "<br />" ) + "</td>";
                user += "</tr>";
            } );
            
            user += "</table>";
        }
        
        $( "#" + leftTabNumber ).html( description + summary + user );
        
        if ( !Report.cvg_data.testplan[ "testplan-0" ].summary.extra )
        {
            $( ".testplan-summary-long" ).find( "th:nth-child( 7 )" ).css( "display", "none" );
            $( ".testplan-summary-long" ).find( "td:nth-child( 7 )" ).css( "display", "none" );
            $( ".testplan-summary-short" ).find( "th:nth-child( 4 )" ).css( "display", "none" );
            $( ".testplan-summary-short" ).find( "td:nth-child( 4 )" ).css( "display", "none" );
        }

        TableDecorator.addHighlighting( $( "#" + leftTabNumber ).find( ".testplan-user" ) );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _isTestVisible = function( logicalName )
    {
        var found = false;
        
        $.each( Report.cvg_data.summary.info || {}, function( key, value )
        {
            if ( $.isArray( value ) )
            {
                $.each( value, function( index, value )
                {
                    var name = value.Merge || value.Test || value.Testplan || "";
                    
                    if ( name.split( ":" ).slice( 1 ).join( ":" ) == logicalName )
                        found = true;
                    
                    return !found;
                } );
            }
            
            return !found;
        } );
        
        return found;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _jumpToTest = function( logicalName )
    {
        var index = $( "#accord-testplan" ).prevAll( "div" ).length;
        
        if ( $( "#accordion-panel" ).accordion( "option", "active" ) != index )
            $( "#accordion-panel" ).accordion( "option", "active", index );
        
        $( "#testplan-0" ).children( "a" ).click();
        
        var tables = $( "#content" ).find( ".ui-tabs-panel" ).eq( 1 ).find( "table" );
        var cells = tables.find( ".toggle-opened, .toggle-closed" ).parent().next();
        
        cells.each( function()
        {
            if ( $( this ).text().split( ":" ).slice( 1 ).join( ":" ) == logicalName )
            {
                Tools.scrollTo( this );
                return false;
            }
        } );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _chooseScope = function( index )
    {
        var kind = index.split( "-" )[ 0 ];
        var parents = Tools.getTreeNodeParents( Report.tree_data[ kind ], index );
    
        if ( $( "#accordion-panel" ).accordion( "option", "active" ) != 0 )
            $( "#accordion-panel" ).accordion( "option", "active", 0 );

        var container = $( "#hierarchy-panel > .tabs" );
        container.tabs( "option", "active", container.find( "ul.ui-tabs-nav li" ).index(
            container.find( "ul.ui-tabs-nav li[aria-controls='tab-" + kind + "']" ) ) );
        
        for ( var i = 0; i < parents.length; ++i )
            $( "#tree-" + kind ).jstree( "open_node", "#" + parents[ parents.length - 1 - i ] );

        $( "#" + index ).children( "a" ).click();
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _chooseCoveritem = function( index )
    {
        $( "#coverage-panel" ).find( ".tree-view" ).each( function()
        {
            var typeAndScope = $( this ).children( "ul" ).children( "li" ).attr( "id" ).split( "_" );
            var type = typeAndScope[ 0 ];
            var scope = typeAndScope[ 1 ];
            var parents = Tools.getTreeNodeParents( Report.tree_data[ type ][ scope ], index );
            
            if ( typeof parents == "object" )
            {
                var container = $( "#coverage-panel > .tabs" );
                container.tabs( "option", "active", container.find( "ul.ui-tabs-nav li" ).index(
                    container.find( "ul.ui-tabs-nav li[aria-controls='tab-" + type + "']" ) ) );
                
                for ( var i = 0; i < parents.length; ++i )
                    $( "#tree-" + type ).jstree( "open_node", "#" + parents[ parents.length - 1 - i ] );
            }
        } );
        
        $( "#" + index ).children( "a" ).click();
    };

    /*-----------------------------------------------------------------------*/

    var _getLeaf = function( path )
    {
        var extended = false;

        for ( var i = path.length - 1; i >= 0; --i )
        {
            if ( path.charAt( i ) == "\\" )
                extended = !extended;
            else if ( path.charAt( i ) == "/" && !extended )
                return path.substr( i + 1 );
        }

        return path;
    };
    
    /*-----------------------------------------------------------------------*/

    var _jumpToPath = function()
    {
        var row = $( this ).parent().parent();
        var cells = row.find( "td" );
        var animation = $( "#accordion-panel" ).accordion( "option", "animate" );
        var tab = Report.nameById[ row.closest( ".ui-tabs-panel" ).attr( "id" ) ];
        var section = tab.split( "-" ).slice( 0, -1 ).join( "-" );
        var index = row.prevAll().length - 1;
        var link = Report.cvg_data.testplan[ section ].links[ index ];
        
        if ( link.scope && !( link.scope in Report.cvg_data ) )
        {
            // Come back when scope is loaded
            Report._loadFile( link.scope, _jumpToPath, this );
            return;
        }
        
        // Do it as quick as possible
        $( "#accordion-panel" ).accordion( "option", "animate", false );
        
        if ( link.scope )
        {
            _chooseScope( link.scope );
            
            if ( link.coveritem )
            {
                _chooseCoveritem( link.coveritem );

                var scopeRow = $( "#rel-" + link.coveritem );
                var targetName = _getLeaf( $( "<div>" + link.path + "</div>" ).text() );

                // Coverpoint or cross bin doesn't have identifier
                if ( link.coveritem.indexOf( "cvg-" ) == 0 && link.type.indexOf( "bin" ) != -1 )
                    for ( var binRow = scopeRow.next(); binRow.length; binRow = binRow.next() )
                        if ( binRow.find( "td" ).first().text() == "bin " + targetName )
                        {
                            scopeRow.find( ".toggle-closed" ).click();
                            Tools.scrollTo( binRow );
                            break;
                        }

                // State, transition and sequence also doesn't have identifier
                if ( link.coveritem[ 0 ] == "m" && !$.isNumeric( link.coveritem.substr( 1 ) ) )
                    for ( var binRow = scopeRow.next(); binRow.length; binRow = binRow.next() )
                        if ( binRow.find( "td" ).first().text() == targetName )
                        {
                            scopeRow.find( ".toggle-closed" ).click();
                            Tools.scrollTo( binRow );
                            break;
                        }

                // Focus on bit if one of transitions was chosen
                if ( link.type == "Toggle bin" )
                {
                    scopeRow.find( ".toggle-closed" ).click();

                    var separator = link.path.charAt( 0 );
                    var bitPath = link.path.split( separator ).slice( 0, -1 ).join( separator );
                    var bitBegin = bitPath.lastIndexOf( scopeRow.find( "td" ).first().text() );

                    for ( var bitRow = scopeRow.next(); bitRow.length; bitRow = bitRow.next() )
                        if ( bitRow.find( "td" ).first().text() == bitPath.slice( bitBegin ) )
                            Tools.scrollTo( bitRow );
                }

                else if ( link.type == "Condition bin" || link.type == "Expression bin" )
                {
                    var searchArea = scopeRow.nextAll();
                    var innerTable = searchArea.find( ".bins" ).eq( 0 );

                    while ( innerTable.length == 0 )
                    {
                        searchArea = searchArea.parent().nextAll();
                        innerTable = searchArea.find( ".bins" ).eq( 0 );
                    }

                    Tools.scrollTo( innerTable.find( "tr" ).eq( targetName.split( "#" )[ 1 ] ) );
                }

                // This should work for statement and branch coverage only
                else
                {
                    var type = link.coveritem.split( "-" )[ 0 ];
                    var fileAndLine = link.line.split( ":" );
                    var file = fileAndLine.slice( 0, -1 ).join( ":" );
                    var line = fileAndLine[ fileAndLine.length - 1 ];
                    var tab = Report.idByName[ Report._makeTabName( type, link.scope, file ) ];
                
                    if ( tab )
                    {
                        Report._selectTab( tab );
                        Report._scrollToLine( tab, line );
                    }
                }
            }
            else
                Report.ui.content.tabs( "option", "active", 0 );
        }
            
        if ( cells.eq( 0 ).text() == "Test" )
            _jumpToTest( cells.eq( 1 ).text() );
        
        $( "#accordion-panel" ).accordion( "option", "animate", animation );
    }
    
    /*-----------------------------------------------------------------------*/
    
    var _loadTestplanLinks = function()
    {
        var selectedSection = $( this ).jstree( "get_selected" )[ 0 ];
        var rightTabName = selectedSection + "-right";
        var rightTabNumber = Report.idByName[ rightTabName ];
        var sectionData = Report.cvg_data.testplan[ selectedSection ];
        var hasAtLeast = false;
        
        var links = "";
        var empty = "No coverage data available for selected node.";
        
        if ( sectionData.links && sectionData.links.length )
        {
            links += "<p>LINKS</p>";
            links += "<table class='border testplan-links'>";
            links += "<tr>";
            links += "<th>Type</th>";
            links += "<th>Link</th>";
            links += "<th>Source</th>";
            links += "<th>Hits/Total</th>";
            links += "<th>Coverage</th>";
            links += "<th>Weight</th>";
            links += "<th>AtLeast</th>";
            links += "</tr>";
            
            $.each( sectionData.links, function( index, link )
            {
                hasAtLeast |= link.goal !== undefined;
                
                var coverage = parseInt( link.coverage );
                var hue = isNaN( coverage ) ? "excluded" : ( coverage == 100 ? "covered" : "uncovered" );
                
                var clickable = !!( link.scope || link.cvg );
                clickable |= link.type == "Test" && _isTestVisible( link.path );
                
                var path = link.path;
                path = clickable ? "<span>" + path + "</span>" : path;
                
                var hits = link.hits;
                hits = link.weight == 0 ? Tools.wrapNumbersInBrackets( hits ) : hits;
            
                links += "<tr class='summary-" + hue + "'>";
                links += "<td>" + link.type + "</td>";
                links += "<td>" + path + "</td>";
                links += "<td" + ( link.line == "-" ? " class='hyphen'" : "" ) + ">" + link.line + "</td>";
                links += "<td>" + hits + "</td>";
                links += "<td>" + link.coverage + "</td>";
                links += "<td>" + link.weight + "</td>";
                links += "<td>" + ( link.goal === undefined ? "" : link.goal ) + "</td>";
                links += "</tr>";
            } );
            
            links += "</table>";
        }
        
        $( "#" + rightTabNumber ).html( links || empty );
        
        var paths = $( "#" + rightTabNumber ).find( "span" );
        paths.click( _jumpToPath );
        paths.css( "cursor", "pointer" );
        paths.css( "text-decoration", "underline" );
        
        if ( !hasAtLeast )
        {
            $( "#" + rightTabNumber ).find( "th:last-child" ).css( "display", "none" );
            $( "#" + rightTabNumber ).find( "td:last-child" ).css( "display", "none" );
        }
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _openTestplanSection = function()
    {
        var selectedSection = $( this ).jstree( "get_selected" )[ 0 ];
        var leftTabName = selectedSection + "-left";
        
        if ( leftTabName in Report.idByName )
            return;
        
        Report._saveView();
        $( ".tree-view" ).not( this ).jstree( "deselect_all" );
        
        var activeTab = Report.ui.content.tabs( "option", "active" );
        
        // Remove all tabs
        while ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length )
            Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(0)" ) );
        
        var leftTabNumber = Report._makeTabId();
        Report.idByName[ leftTabName ] = leftTabNumber;
        Report.nameById[ leftTabNumber ] = leftTabName;
        
        if ( selectedSection == "testplan-0" )
        {
            Report._addTab( leftTabNumber, "Verification Plan - Cumulative Summary" );
            _loadTestplanCumulativeSummary.call( this );
            Report._addInfoTab();
        }
        else
        {
            var selectedName = Report.cvg_data.testplan[ selectedSection ].name;
            
            Report._addTab( leftTabNumber, "Summary - " + selectedName );
            _loadTestplanSummary.call( this );
            
            var rightTabName = selectedSection + "-right";
            var rightTabNumber = Report._makeTabId();
            Report.idByName[ rightTabName ] = rightTabNumber;
            Report.nameById[ rightTabNumber ] = rightTabName;
            Report._addTab( rightTabNumber, "Links - " + selectedName );
            _loadTestplanLinks.call( this );
        }
        
        activeTab = Math.min( activeTab, $( "#content .ui-tabs-nav > li" ).length - 1 );
        Report.ui.content.tabs( "option", "active", activeTab );
    };
    
    /*-----------------------------------------------------------------------*/

    var _loadTree = function()
    {
        var options = $.extend( {}, Report.BASIC_TREE_OPTIONS );
        options.core.data = Report.tree_data.testplan;
        options.core.worker = false;
        $( "#accord-tree-testplan" ).bind( "redraw.jstree open_node.jstree", Report._removeLocation );
        $( "#accord-tree-testplan" ).jstree( options ).bind( "select_node.jstree", _openTestplanSection );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _selectRoot = function()
    {
        var tree = $( "#accord-tree-testplan" );
        
        // Select root without animation
        var state = tree.jstree( "get_state" );
        state.core.selected = [ "testplan-0" ];
        tree.jstree( "set_state", state );
        
        _openTestplanSection.call( tree );
        
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
