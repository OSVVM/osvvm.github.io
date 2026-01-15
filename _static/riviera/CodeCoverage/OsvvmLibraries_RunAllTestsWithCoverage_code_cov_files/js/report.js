var Report =
{
    BASIC_TREE_OPTIONS:
    {
        core:
        {
            animation: 0,
            data: [],
            multiple: false,
            themes: { variant: "small" }
        },
        plugins: [ "contextmenu", "fast_open_close" ],
        contextmenu:
        {
            items: function( node )
            {
                var menu =
                {
                    expandAll: {
                        label: "Expand All",
                        action: function() {
                            $.jstree.reference( node ).fast_open_all();
                            $( "#" + node.id ).children( ".jstree-anchor" ).focus();
                        }
                    },
                    expandSelected: {
                        label: "Expand Selected",
                        action: function() {
                            $.jstree.reference( node ).fast_open_branch( node.id );
                            $( "#" + node.id ).children( ".jstree-anchor" ).focus();
                        }
                    },
                    collapseAll: {
                        label: "Collapse All",
                        action: function() {
                            var tree = $( "#" + node.id ).closest( ".tree-view" );
                            $.jstree.reference( node ).fast_close_all();
                            tree.children().children().children( ".jstree-anchor" ).focus();
                        }
                    },
                    collapseSelected: {
                        label: "Collapse Selected",
                        action: function() {
                            $.jstree.reference( node ).fast_close_branch( node.id );
                            $( "#" + node.id ).children( ".jstree-anchor" ).focus();
                        }
                    }
                };
                
                if ( $.jstree.reference( node ).get_container().filter( "#tree-inst" ).length )
                {
                    var unit = Report.units[ node.id ];
                    
                    menu.findInUnits =
                    {
                        _disabled: typeof unit == "undefined",
                        label: "Find in Units",
                        action: function()
                        {
                            $( "#hierarchy-panel > .tabs" ).tabs( "option", "active", 1 );
                            
                            var parents = Tools.getTreeNodeParents( Report.tree_data.du, unit );
                            
                            for ( var i = 0; i < parents.length; ++i )
                                $( "#tree-du" ).jstree( "open_node", "#" + parents[ parents.length - 1 - i ] );

                            $( "#" + unit ).children( "a" ).click();
                        }
                    };
                }
                
                return menu;
            },
            select_node: false,
            show_at_node: false
        }
    },

    cvg_data: {},
    tree_data: {},

    idByName: {},
    nameById: {},

    sources: {},
    brushes: {},
    units: {},

    ui: {},

    filesFolder: "",

    tabCounter: 0,
    
    contentTabSwitcher: null,
    hierarchyTabSwitcher: null,
    coverageTabSwitcher: null,
    
    /*-----------------------------------------------------------------------*/

    init: function( filesFolder )
    {
        // Workaround for unexpected events
        if ( navigator.userAgent.indexOf( "Riviera-PRO" ) != -1 )
            window.addEventListener( "mouseover", Report._stopFullscreenEvents, true );
        
        if ( Report.cvg_data.history )
        {
            CounterManager.loadTests( Report.cvg_data.history.tests );
            CounterManager.loadLists( Report.cvg_data.history.lists );
        }
        
        this.filesFolder = filesFolder;
        this._initUi();
        this._resolveDuplicatedId();
        this._showDesignHierarchy();
        
        Report._loadFile( "../js/startup", function() { Startup.run(); }, this );
    },

    /*-----------------------------------------------------------------------*/

    _stopFullscreenEvents: function( event )
    {
        if ( event.screenX == event.clientX && event.screenY == event.clientY )
            event.stopPropagation();
    },

    /*-----------------------------------------------------------------------*/

    _initUi: function()
    {
        Report.contentTabSwitcher = new TabSwitcher();
        Report.contentTabSwitcher.initialize( $( "#content.tabs" ) );

        Report.hierarchyTabSwitcher = new TabSwitcher();
        Report.hierarchyTabSwitcher.initialize( $( "#hierarchy-panel > .tabs" ) );

        Report.coverageTabSwitcher = new TabSwitcher();
        Report.coverageTabSwitcher.initialize( $( "#coverage-panel > .tabs" ) );
        
        this._removeDummyElements(); // Elements exist only for successful validation
        this._removeUnusedElements(); // Generated report has always all coverage types
        this._initTabs();
        
        // Location cause unwanted hint at the bottom of the page
        Report.coverageTabSwitcher.removeLocation();
        Report.hierarchyTabSwitcher.removeLocation();
        
        if ( $( "#sidebar" ).length )
            this._initSplitters();
        
        Report._calculateMargins();
        
        if ( $( "#accord-design ul > li" ).length )
        {
            Report.coverageTabSwitcher.onNewTab();
            Report.hierarchyTabSwitcher.onNewTab();
        }
        
        // Make custom tooltips
        $( document ).tooltip();
        $( document ).tooltip( "option", "content", function() { return $( this ).attr( "title" ); } );
        $( document ).tooltip( "option", "hide", false );
        $( document ).tooltip( "option", "position", { my: "left top+21", collision: "flipfit" } );
        $( document ).tooltip( "option", "show", { delay: 500, duration: 0 } );
        $( document ).tooltip( "option", "tooltipClass", "tooltip" );
        $( document ).tooltip( "option", "track", true );
        $( document ).off( "focusin focusout" );
        
        // Custom tooltip should act as embedded
        $( document ).on( "keydown", function() { $( ".tooltip" ).hide(); } );
        
        // Custom context menu should act as embedded
        $( document ).on( "keydown", ".vakata-context", function( event )
        {
            if ( event.keyCode == $.ui.keyCode.ENTER )
                $( this ).find( ":focus" ).click();
        } );
    },
    
    /*-----------------------------------------------------------------------*/
    
    _removeDummyElements: function()
    {
        $( "#content" ).find( "li" ).remove();
        $( "#template-summary" ).find( "tbody" ).remove();
        $( "#template-info" ).find( "tbody" ).remove();
    },
    
    /*-----------------------------------------------------------------------*/

    _removeUnusedElements: function()
    {
        if ( !Report.tree_data.inst )
        {
            $( "#hierarchy-panel a[href='#tab-inst']" ).parent().remove(); // li
            $( "#tab-inst" ).remove(); // div
        }
        
        if ( !Report.tree_data.du )
        {
            $( "#hierarchy-panel a[href='#tab-du']" ).parent().remove(); // li
            $( "#tab-du" ).remove(); // div
        }

        if ( !Report.tree_data.file )
        {
            $( "#hierarchy-panel a[href='#tab-file']" ).parent().remove(); // li
            $( "#tab-file" ).remove(); // div
        }
        
        var havingStatement = false;
        var havingBranch = false;
        var havingCovergroup = false;
        var havingExpression = false;
        var havingCondition = false;
        var havingToggle = false;
        var havingAssertion = false;
        var havingPath = false;
        var havingMachine = false;

        $.each( Report.cvg_data.summary || {}, function( index, value )
        {
            if ( index == "inst" || index == "du" || index == "file" )
            {
                $.each( value.summary.statistics, function( index, value )
                {
                    switch ( value.data )
                    {
                        case "Statement Coverage":
                            havingStatement = true;
                            break;
                        case "Branch Coverage":
                            havingBranch = true;
                            break;
                        case "Covergroup Coverage":
                            havingCovergroup = true;
                            break;
                        case "Expression Coverage":
                            havingExpression = true;
                            break;
                        case "Condition Coverage":
                            havingCondition = true;
                            break;
                        case "Toggle Coverage":
                            havingToggle = true;
                            break;
                        case "Assertion Coverage":
                            havingAssertion = true;
                            break;
                        case "Path Coverage":
                            havingPath = true;
                            break;
                        case "FSM Coverage":
                            havingMachine = true;
                            break;
                    }
                } );
            }
        } );
        
        if ( havingStatement == false )
        {
            $( "#coverage-panel a[href='#tab-stmt']" ).parent().remove(); // li
            $( "#tab-stmt" ).remove(); // div
        }
        
        if ( havingBranch == false )
        {
            $( "#coverage-panel a[href='#tab-branch']" ).parent().remove(); // li
            $( "#tab-branch" ).remove(); // div
        }
        
        if ( havingCovergroup == false )
        {
            $( "#coverage-panel a[href='#tab-cvg']" ).parent().remove(); // li
            $( "#tab-cvg" ).remove(); // div
        }
        
        if ( havingExpression == false )
        {
            $( "#coverage-panel a[href='#tab-exc']" ).parent().remove(); // li
            $( "#tab-exc" ).remove(); // div
        }
        
        if ( havingCondition == false )
        {
            $( "#coverage-panel a[href='#tab-cec']" ).parent().remove(); // li
            $( "#tab-cec" ).remove(); // div
        }
        
        if ( havingToggle == false )
        {
            $( "#coverage-panel a[href='#tab-toggle']" ).parent().remove(); // li
            $( "#tab-toggle" ).remove(); // div
        }
        
        if ( havingAssertion == false )
        {
            $( "#coverage-panel a[href='#tab-assertion']" ).parent().remove(); // li
            $( "#tab-assertion" ).remove(); // div
        }
        
        if ( havingPath == false )
        {
            $( "#coverage-panel a[href='#tab-path']" ).parent().remove(); // li
            $( "#tab-path" ).remove(); // div
        }

        if ( havingMachine == false )
        {
            $( "#coverage-panel a[href='#tab-machine']" ).parent().remove(); // li
            $( "#tab-machine" ).remove(); // div
        }
        
        if ( $( "#accord-design ul > li" ).length == 0 )
        {
            $( "#accord-design" ).prev().remove(); // h3
            $( "#accord-design" ).remove(); // div
        }
        
        if ( !Report.cvg_data[ "cvg-all" ] )
        {
            $( "#accord-cvg" ).prev().remove(); // h3
            $( "#accord-cvg" ).remove(); // div
        }
        
        if ( !Report.cvg_data.testplan )
        {
            $( "#accord-testplan" ).prev().remove(); // h3
            $( "#accord-testplan" ).remove(); // div
        }
        
        if ( !Report.cvg_data.ranking )
        {
            $( "#accord-ranking" ).prev().remove(); // h3
            $( "#accord-ranking" ).remove(); // div
        }
        
        if ( $( "#accordion-panel" ).children( "h3" ).length == 0 )
            $( "#sidebar" ).remove();
    },

    /*-----------------------------------------------------------------------*/
    
    _removeLocation: function()
    {
        // Location cause unwanted hint at the bottom of the page
        $( this ).find( "a" ).removeAttr( "href" ).css( "cursor", "pointer" );
    },
    
    /*-----------------------------------------------------------------------*/

    _initTabs: function()
    {
        // Init accordion
        $( "#accordion-panel" ).accordion(
        {
            header: "h3",
            heightStyle: "fill",
            collapsible: true
        } );

        // Init sidebar tabs
        $( "#coverage-panel > .tabs" ).tabs();
        $( "#hierarchy-panel > .tabs" ).tabs();

        Report.ui.content = $( "#content" ).tabs(
        {
            select: function( event, ui )
            {
                $( ui.tab ).parent().select();
            }
        } );

        $( ".ui-tabs-nav, .ui-tabs-nav > *" ).removeClass( "ui-corner-all ui-corner-top" );
        $( ".tabs-bottom .ui-tabs-nav > *" ).addClass( "ui-corner-bottom" );
        
        $( window ).bind( "resize", function( event )
        {
            if ( event.target != window )
                return;
            
            Report._calculateMargins();
            
            $( "#accordion-panel" ).accordion( "refresh" );
            
            Report.contentTabSwitcher.handleContainerResize();
            
            if ( $( "#accord-design ul > li" ).length )
            {
                Report.hierarchyTabSwitcher.handleContainerResize();
                Report.coverageTabSwitcher.handleContainerResize();
            }

            TableDecorator.refreshHeaders();
        } );
        
        $( "#content" ).on( "tabsactivate", TableDecorator.refreshHeaders );
        
        Report.contentTabSwitcher.ul.removeAttr( "style" );
        
        if ( $( "#accord-design ul > li" ).length )
        {
            Report.coverageTabSwitcher.ul.removeAttr( "style" );
            Report.hierarchyTabSwitcher.ul.removeAttr( "style" );
        }
    },

    /*-----------------------------------------------------------------------*/

    _initSplitters: function()
    {
        // Calculate minimal width of sidebar when both tab panels are in single line
        var maxWidthAbsolute = 0;
        $( "#sidebar ul.ui-tabs-nav" ).each( function()
        {
            var width = $( this ).outerWidth( true ) - $( this ).width();
            $( this ).children().each( function() { width += $( this ).outerWidth( true ); } );
            maxWidthAbsolute = width > maxWidthAbsolute ? width : maxWidthAbsolute;
        } );
        
        // Make place for two buttons in content panel
        var buttonsWidth = 2 * Report.contentTabSwitcher.butOuterWidth;
        maxWidthAbsolute = Math.min( maxWidthAbsolute, $( "body" ).width() - buttonsWidth );

        // Width should be relative and not lower than 25%
        var maxWidthRelative = maxWidthAbsolute / $( "body" ).width() * 100;
        maxWidthRelative = 25 > maxWidthRelative ? 25 : maxWidthRelative;
        $( "#sidebar" ).css( "width", maxWidthRelative + "%" );
        $( "#content" ).css( "left", maxWidthRelative + "%" );
        
        $( "#sidebar" ).resizable(
        {
            handles: "e",
            resize: function( event, ui )
            {
                // Buttons can be enabled or disabled due to changes
                Report.contentTabSwitcher.handleContainerResize();
                if ( $( "#accord-design ul > li" ).length )
                {
                    Report.hierarchyTabSwitcher.handleContainerResize();
                    Report.coverageTabSwitcher.handleContainerResize();
                }
            
                // Width have to be converted to relative values
                var sidebarRelativeWidth = ui.size.width / ui.element.parent().width() * 100;
                ui.element.css( "width", sidebarRelativeWidth + "%" );
                $( "#content" ).css( "left", sidebarRelativeWidth + "%" );
                
                // Remove absolute values set in height by plugin
                ui.element.css( "height", "" );

                TableDecorator.refreshHeaders();
            }
        } );

        $( "#hierarchy-panel" ).resizable(
        {
            handles: "s",
            resize: function( event, ui )
            {
                var parentHeight = ui.element.parent().height();

                var top = 100 * ui.size.height / parentHeight;
                top = top < 10 ? 10 : top;
                top = top > 90 ? 90 : top;

                ui.element.css( { width: "", height: top + "%", top: 0 } );
                $( "#coverage-panel" ).css( { width: "", height: "", top: top + "%" } );
            }
        } );
    },

    /*-----------------------------------------------------------------------*/
    
    _resolveDuplicatedId: function()
    {
        if ( arguments.length == 0 )
        {
            if ( Report.tree_data[ "cvg-all" ] )
            {
                Report._resolveDuplicatedId( Report.tree_data[ "cvg-all" ] );
                
                $.each( Report.cvg_data[ "cvg-all" ].cvg, function()
                {
                    Report._resolveDuplicatedId( this );
                } );
            }
            
            return;
        }
        
        // Tree part
        if ( arguments[ 0 ].id )
        {
            arguments[ 0 ].id = "w" + ( arguments[ 0 ].id.split( "-" )[ 1 ] || "0" );
            
            $.each( arguments[ 0 ].children || [], function()
            {
                Report._resolveDuplicatedId( this );
            } );
        }
        
        // Coverage part
        if ( arguments[ 0 ].rel )
            arguments[ 0 ].rel = "w" + arguments[ 0 ].rel.split( "-" )[ 1 ];
    },

    /*-----------------------------------------------------------------------*/

    _showDesignHierarchy: function()
    {
        $( "#hierarchy-panel .tree-view" ).each( function()
        {
            var key = this.id.split( "-" )[ 1 ];
            var node = Report.tree_data[ key ];
            var options = $.extend( {}, Report.BASIC_TREE_OPTIONS );
            options.core.data = node;
            $.extend( options.core.data, { state: { opened: true } } );
            options.core.worker = false;
            $( this ).bind( "redraw.jstree open_node.jstree", Report._removeLocation );
            $( this ).jstree( options ).bind( "select_node.jstree", Report._showScope );
        } );
        
        $( "#tree-inst" ).one( "show_contextmenu.jstree", function( event, data )
        {
            Report._loadFile(
                "units",
                $.jstree.reference( data.node ).show_contextmenu,
                $.jstree.reference( data.node ),
                [ data.node, data.x, data.y ] );
        } );
        
        CovergroupLoader.loadTree();
        PlanLoader.loadTree();
        RankingLoader.loadTree();
        
        if ( $( "#tab-inst" ).length )
            Report._showRootSummary( "inst" );
        else if ( $( "#tab-du" ).length )
            Report._showRootSummary( "du" );
        else if ( $( "#tab-file" ).length )
            Report._showRootSummary( "file" );
        else if ( $( "#accord-cvg" ).length )
            CovergroupLoader.selectRoot();
        else if ( $( "#accord-testplan" ).length )
            PlanLoader.selectRoot();
        else if ( $( "#accord-ranking" ).length )
            RankingLoader.selectRoot();
        else
            Report._addInfoTab();
        
        Report.ui.content.tabs( "option", "active", 0 );
    },

    /*-----------------------------------------------------------------------*/

    _makeTabId: function()
    {
        return "tab-" + ( Report.tabCounter++ );
    },

    /*-----------------------------------------------------------------------*/

    _makeTabName: function()
    {
        return Array.prototype.slice.call( arguments ).join( "::" );
    },

    /*-----------------------------------------------------------------------*/

    _selectTab: function( tabId )
    {
        Report.ui.content.tabs( "option", "active",
            Report.ui.content.find( "[aria-controls='" + tabId + "']" ).prevAll().length );
    },

    /*-----------------------------------------------------------------------*/

    _scrollToItem: function( item_id )
    {
        var typeAndIndex = item_id.split( "-" );
        var index = parseInt( typeAndIndex[ 1 ] );
        var target = $( "#rel-" + item_id );

        // Support for expressions having representation only on tree
        while ( target.length == 0 && index > 1 )
            target = $( "#rel-" + typeAndIndex[ 0 ] + "-" + ( --index ) );

        if ( target.length == 0 )
        {
            $( "#content" ).find( ".ui-tabs-panel" ).scrollTop( 0 );
            return;
        }

        TableDecorator.expandTo( target.closest( "tr" ) );
            
        // Broken browsers are losing relative coordinates of element after hiding and showing it
        while ( target[ 0 ].offsetParent == null && target.children().length )
            target = target.children().eq( 0 );

        Tools.scrollTo( target );
    },

    /*-----------------------------------------------------------------------*/

    _scrollToLine: function( tabId, targetLine )
    {
        Report._selectTab( tabId );
        
        var link = [ tabId, "line", targetLine ].join( "-" );
        var target = $( "#" + link );

        if ( target.length == 0 )
        {
            $( "#content" ).find( ".ui-tabs-panel" ).scrollTop( 0 );
            return;
        }
        
        // Skip frozen header
        var above = target.prev();

        if ( above.length == 0 )
            target = target.closest( "table" );

        else
        {
            above = above.prev();

            if ( above.length == 0 )
                target = target.closest( "table" ).find( "thead" ).find( "tr" ).last();
            else
                target = above;
        }

        Tools.scrollTo( target );
    },

    /*-----------------------------------------------------------------------*/

    _saveView: function()
    {
        // Currently there is no more than one expandable table in panel so save view as panel name
        $( "table" ).has( ".toggle-static-last" ).each( function()
        {
            var name = Report.nameById[ $( this ).closest( ".ui-tabs-panel" ).attr( "id" ) ];
            TableDecorator.saveView( name, this );
        } );
    },

    /*-----------------------------------------------------------------------*/

    _loadFile: function( inst_id, callback, invokeIn, invokeWith )
    {
        var script = document.createElement( "script" );
        script.type = "text/javascript";
        script.src = Report.filesFolder + "/data/" + inst_id + ".js";
        
        script.onload = script.onreadystatechange = function()
        {
            if ( !script.readyState || script.readyState == "loaded" || script.readyState == "complete" )
            {
                script.onload = script.onreadystatechange = null;
                callback.apply( invokeIn, invokeWith );
            }
        };
        
        document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
    },

    /*-----------------------------------------------------------------------*/

    _showScope: function()
    {
        // Node in other tree was selected during loading
        if ( $( this ).jstree( "get_selected" ).length == 0 )
            return;
        
        Report._saveView();
        $( ".tree-view" ).not( this ).jstree( "deselect_all" );
        
        var inst_id = $( this ).jstree( "get_selected" )[ 0 ];
        
        if ( inst_id == "du" || inst_id == "inst" || inst_id == "file" )
        {
            var isSummaryChosen = $( "#content ul > li:first-child" ).hasClass( "ui-tabs-active" );
        
            $( "#coverage-panel .tree-view" ).each( function()
            {
                if ( $( this ).jstree( true ) )
                    $( this ).jstree( "destroy" );
            } );
            
            // Add summary and optional report info
            Report._showRootSummary( inst_id );
            
            // Switch to report info if possible and necessary
            if ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length > 1 && isSummaryChosen == false )
                Report._selectTab( Report.idByName.info );
        }
        else
        {
            // Load data if necessary
            if ( !( inst_id in Report.cvg_data ) )
            {
                Report._loadFile( inst_id, Report._showScope, this );
                return;
            }
            
            // Init coverage hierarchy trees
            $( "#coverage-panel .tree-view" ).each( function()
            {
                var key = this.id.split( "-" )[ 1 ];
                var node;

                if ( key in Report.tree_data )
                    node = Report.tree_data[ key ][ inst_id ];
                else
                    node = {};
                
                $.extend( node, { state: { opened: true } } );
                
                if ( !$( this ).jstree( true ) )
                {
                    var options = $.extend( {}, Report.BASIC_TREE_OPTIONS );
                    options.core.data = node;
                    options.core.worker = false;
                    $( this ).bind( "redraw.jstree open_node.jstree", Report._removeLocation );
                    $( this ).jstree( options ).bind( "select_node.jstree", Report._showCoveritem );
                }
                else                
                {
                    $( this ).jstree().close_all();
                    $( this ).jstree().settings.core.data = node;
                    $( this ).jstree().refresh();
                }
            } );
            
            var chosenTab = $( "#content li.ui-tabs-active" ).prevAll().length;
            var summaryId = Report._makeTabName( "summary", inst_id );
            
            // Rebuild tabs if other scope is chosen
            if ( !( summaryId in Report.idByName ) )
            {
                // Remove all tabs
                while ( Report.ui.content.find( ".ui-tabs-nav li" ).length )
                    Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(0)" ) );
                
                // Add summary
                var tabId = Report._makeTabId();
                Report.idByName[ summaryId ] = tabId;
                Report.nameById[ tabId ] = summaryId;
                
                var key = inst_id.split( "-" )[ 0 ];
                var isFlat = key != "inst";
                var inst_name = Report._extractNameFromNode( $( "#" + inst_id ) );
                Report._addTab( tabId, "Summary - " + inst_name );
      
                var cvgData = Report.cvg_data[ inst_id ];
                Report._showSummary( tabId, cvgData, isFlat );
            }
            
            if ( $( "#coverage-panel li.ui-tabs-active" ).length )
            {
                var chosenType = $( "#coverage-panel li.ui-tabs-active" ).attr( "aria-controls" ).split( "-" )[ 1 ];
                
                switch ( chosenType )
                {
                    case "stmt":
                    case "branch":
                        Report._loadCodeCoverage( inst_id, inst_id, false );
                        break;
                    case "cvg":
                        CovergroupLoader.addTab( inst_id, inst_id, false );
                        break;
                    case "exc":
                        ExpressionLoader.addExpressionTab( inst_id, inst_id, false );
                        break;
                    case "cec":
                        ExpressionLoader.addConditionTab( inst_id, inst_id, false );
                        break;
                    case "toggle":
                        ToggleLoader.addTab( inst_id, inst_id, false );
                        break;
                    case "assertion":
                        AssertionLoader.addTab( inst_id, inst_id, false );
                        break;
                    case "path":
                        PathLoader.addTab( inst_id, undefined, false );
                        break;
                    case "machine":
                        MachineLoader.addTabs( inst_id );
                        break;
                }
            }
            
            chosenTab = Math.min( chosenTab, $( "#content .ui-tabs-nav > li" ).length - 1 );
            Report.ui.content.tabs( "option", "active", chosenTab );
        }
    },

    /*-----------------------------------------------------------------------*/

    _showRootSummary : function( key )
    {
        var tabTitle = $( "#accordion-panel" ).children( ".ui-state-active" ).text();
        tabTitle += " ";
        tabTitle += $( "#hierarchy-panel" ).find( ".ui-state-active" ).text();
        tabTitle += " - Cumulative Summary";

        var tabName = Report._makeTabName( "summary", key );
        
        if ( !( tabName in Report.idByName ) )
        {
            var tabId = Report._makeTabId();
            Report.idByName[ tabName ] = tabId;
            Report.nameById[ tabId ] = tabName;
            
            // Remove all tabs
            while ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(0)" ) );

            Report._addTab( tabId, tabTitle );
            Report._addInfoTab();

            var data = Report.cvg_data.summary[ key ];
            
            if ( data )
            {
                var table_rows = [];
                var summary = data.summary;
                Report._generateSummaryTable( summary, table_rows, "Hits/Total", "Hits/Total" );
                
                var strAppendAfter;
                
                if ( key == "du" )
                {
                    strAppendAfter =
                        "<p class='summary-footer'>CUMULATIVE DESIGN-BASED COVERAGE: " + summary.wa_recursive +
                        "<br>COVERED DESIGN UNITS: " + summary.covered + " / " + summary.total +
                        "<br>FILES: " + summary.files + "</p>";
                }
                else if ( key == "inst" )
                {
                    strAppendAfter =
                        "<p class='summary-footer'>CUMULATIVE INSTANCE-BASED COVERAGE: " + summary.wa_recursive +
                        "<br>COVERED INSTANCES: " + summary.covered + " / " + summary.total +
                        "<br>FILES: " + summary.files + "</p>";
                }
                else
                {
                    strAppendAfter =
                        "<p class='summary-footer'>CUMULATIVE FILE-BASED COVERAGE: " + summary.wa_recursive +
                        "<br>COVERED FILES: " + summary.covered + " / " + summary.total + "</p>";
                }
                
                var content = $( "#template-summary > table" ).clone().append( table_rows.join( "" ) );
                
                $( "#" + tabId ).html( "<p>CUMULATIVE SUMMARY</p>" );
                $( "#" + tabId ).append( content );
                $( "#" + tabId ).append( strAppendAfter );
            }
            
            Report._addUserAttributes( $( "#" + tabId ), Report.cvg_data.summary.user );
            
            if ( $( "#" + tabId ).find( "table" ).length == 0 )
                $( "#" + tabId ).html( "No data to display." );

            TableDecorator.addHighlighting( $( "#" + tabId ).children( "table" ) );
        }
    },

    /*-----------------------------------------------------------------------*/

    _addInfoTab: function()
    {
        if ( Report.cvg_data.summary.info === undefined )
            return;

        if ( "info" in Report.idByName )
            return; // Already shown
        
        var rows = "<tr><th>Property</th><th>Value</th></tr>";
        var details = "";
        
        $.each( Report.cvg_data.summary.info, function( index, value )
        {
            if ( $.isArray( value ) && value.length == 0 )
                return true;
            
            rows += "<tr><td>" + index + "</td>";
            
            if ( $.isArray( value ) )
            {
                var level = 0;
                var tests = 0;
            
                details += "<br><p>TEST DETAILS</p><table class='border'>";
                details += "<tr><th>Property</th><th>Value</th></tr>";
                
                $.each( value, function( index, value )
                {
                    if ( value == "-" )
                    {
                        --level;
                        return true;
                    }
                    
                    if ( value.Test )
                        ++tests;
                    
                    var hue = "gray";
                    hue = value.Status == "Error" || value.Status == "Fatal" ? "red" : hue;
                    hue = value.Status == "Warning" ? "yellow" : hue;
                    hue = value.Status == "Ok" ? "green" : hue;
                    hue = " class='" + hue + "'";
                    
                    $.each( value, function( index, value )
                    {
                        var padding = " style='padding-left: " + ( 18 * level + ( hue ? 4 : 22 ) ) + "px'";
                        value = Tools.forceWhiteSpaces( value );
                        details += "<tr" + hue + "><td" + padding + ">" + index + "</td>";
                        details += "<td>" + value + "</td></tr>";
                        hue = "";
                    } );
                    
                    if ( value.Merge || value.Edit )
                        ++level;
                } );
                
                details += "</table>";
                rows += "<td>" + tests + "</td></tr>";
            }
            else
                rows += "<td>" + Tools.forceWhiteSpaces( value ) + "</td></tr>";
        } );
        
        var tabName = "info";
        var tabId = Report._makeTabId();
        Report.idByName[ tabName ] = tabId;
        Report.nameById[ tabId ] = tabName;
        Report._addTab( tabId, "Report Info - Cumulative Summary" );
            
        $( "#" + tabId ).append( "<p>SUMMARY</p>" );
        $( "#" + tabId ).append( $( "#template-info > table" ).clone().append( rows ) );
        $( "#" + tabId ).append( details );
        
        TableDecorator.addHighlighting( $( "#" + tabId ).children( "table" ) );
        TableDecorator.addExpanding( $( "#" + tabId ).children( "table" ).slice( 1 ) );
        TableDecorator.loadView( tabName, $( "#" + tabId ).children( "table" ).slice( 1 ) );
    },

    /*-----------------------------------------------------------------------*/
    
    _removeTab: function( tab )
    {
        var tabId = tab.remove().attr( "aria-controls" );
        $( "#" + tabId ).remove();
        delete Report.idByName[ Report.nameById[ tabId ] ];
        delete Report.nameById[ tabId ];
    },
    
    /*-----------------------------------------------------------------------*/
    
    _addTab: function( tabId, title )
    {
        Report.contentTabSwitcher.addLocation();
        $( "<li><a href='#" + tabId + "'>" + title + "</a></li>" ).appendTo( Report.ui.content.find( "ul.ui-tabs-nav" ) );
        Report.ui.content.find( "ul.ui-tabs-nav" ).find( "a" ).last().wrapInner( "<span></span>" );
        $( "<div id=" + tabId + "></div>" ).appendTo( Report.ui.content.children( ".ui-tabs-wrapper" ) );
        Report.ui.content.tabs( "refresh" );
        Report.contentTabSwitcher.onNewTab();
        Report.contentTabSwitcher.removeLocation();
    },

    /*-----------------------------------------------------------------------*/

    _generateSummaryTable: function( summary, table_rows, local_header, recursive_header )
    {
        var header_row_str = "<tr><th>Coverage Type</th><th>Weight</th>";
        
        if ( summary.wa_local )
            header_row_str += "<th>" + local_header + "</th>";

        if ( summary.wa_recursive )
            header_row_str += "<th>" + recursive_header + "</th>";
        
        header_row_str += "</tr>";
        table_rows.push( header_row_str );
        
        // Fill the rows
        $.each( summary.statistics, function( index, value )
        {
            var row_str = "<tr";
            
            if ( value.status )
                row_str += " class='summary-" + value.status + "'";

            row_str += "><td class='summary-type' align=left>" + value.data + "</td>";
            row_str += "<td align=right>";
            
            if ( typeof value.weight != "undefined" )
                row_str += value.weight;
            
            row_str += "</td>";
            
            if ( summary.wa_local )
            {
                row_str += "<td align=right>";
                row_str += typeof value.lmsg != "undefined" ? value.lmsg : "";
                row_str += typeof value.lhits != "undefined" ? value.lhits : "";
                row_str += typeof value.ltotal != "undefined" ? " / " + value.ltotal : "";
                row_str += "</td>";
            }

            if ( summary.wa_recursive )
            {
                row_str += "<td align=right>";
                row_str += typeof value.rmsg != "undefined" ? value.rmsg : "";
                row_str += typeof value.rhits != "undefined" ? value.rhits : "";
                row_str += typeof value.rtotal != "undefined" ? " / " + value.rtotal : "";
                row_str += "</td>";
            }

            row_str += "</tr>";
            table_rows.push( row_str );
        } );
    },

    /*-----------------------------------------------------------------------*/

    _showSummary: function( tabId, cvg_data, isFlat )
    {
        var summary = cvg_data.summary;
        var table_rows = [];
        var local_header = summary.wa_recursive ? "Local Hits/Total" : "Hits/Total";
        var recursive_header = isFlat ? "Hits/Total" : "Recursive Hits/Total";
        Report._generateSummaryTable( summary, table_rows, local_header, recursive_header );
        
        var content = $( "#template-summary > table" ).clone().append( table_rows.join( "" ) );
        var strAppendAfter = "";
        
        if ( summary.wa_local )
        {
            strAppendAfter = "<p class='summary-footer'>WEIGHTED AVERAGE LOCAL: " + summary.wa_local;

            if ( summary.wa_recursive )
                strAppendAfter += "<br>" + "WEIGHTED AVERAGE RECURSIVE: " + summary.wa_recursive;
        }
        else
            strAppendAfter = "<p class='summary-footer'>WEIGHTED AVERAGE: " + summary.wa_recursive;

        if ( summary.exclusions )
        {
            strAppendAfter += "<br>EXCLUSIONS";
            $.each( summary.exclusions, function( index, value )
            {
                strAppendAfter += "<br>" + Tools.escapeHTML( value );
            } );
        }

        strAppendAfter += "</p>";
        
        if ( table_rows.length != 1 )
        {
            $( "#" + tabId ).html( "<p>SUMMARY</p>" );
            $( "#" + tabId ).append( content );
            $( "#" + tabId ).append( strAppendAfter );
        }
        
        Report._addUserAttributes( $( "#" + tabId ), summary.user );
        TableDecorator.addHighlighting( $( "#" + tabId ).children( "table" ) );
        
        if ( $( "#" + tabId ).children( "table" ).length == 0 )
            $( "#" + tabId ).html( "No coverage data available for selected node." );
    },

    /*-----------------------------------------------------------------------*/

    _addUserAttributes: function( tab, attributes )
    {
        if ( typeof attributes == "undefined" )
            return;

        var table = "<p>USER ATTRIBUTES</p>";
        table += "<table class='border testplan-user'><tr><th>Name</th><th>Value</th></tr>";

        $.each( attributes, function( name, value )
        {
            table += "<tr><td>";
            table += name;
            table += "</td><td>";
            table += Tools.forceWhiteSpaces( value );
            table += "</td></tr>";
        } );

        table += "</table>";
        
        if ( tab.find( "p" ).length )
            tab.append( "<br>" );
        
        tab.append( table );
    },

    /*-----------------------------------------------------------------------*/

    _showCoveritem: function()
    {
        Report._saveView();
        $( ".tree-view" ).not( this ).jstree( "deselect_all" );

        var root_node = $( this ).jstree( "get_node", "ul>li:first" );
        var node_id = $( this ).jstree( "get_selected" )[ 0 ];
        var root_pieces = root_node.id.split( "_" );
        var cvg_type = root_pieces[ 0 ];
        var root_id = root_pieces[ 1 ];
        node_id = node_id == root_node.id ? root_id : node_id;

        var summaryId = Report._makeTabName( "summary", root_id );
        
        // Rebuild tabs if other scope is chosen
        if ( !( summaryId in Report.idByName ) )
        {
            // Remove all tabs
            while ( Report.ui.content.find( "ul.ui-tabs-nav li" ).length )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(0)" ) );
            
            // Add summary
            var tabId = Report._makeTabId();
            Report.idByName[ summaryId ] = tabId;
            Report.nameById[ tabId ] = summaryId;
            
            var key = root_id.split( "-" )[ 0 ];
            var isFlat = key != "inst";
            
            var inst_name = Report._extractNameFromNode( $( "#" + root_id ) );
            Report._addTab( tabId, "Summary - " + inst_name );
            
            var cvgData = Report.cvg_data[ root_id ];
            Report._showSummary( tabId, cvgData, isFlat );
        }

        switch ( cvg_type )
        {
            case "stmt":
            case "branch":
                Report._loadCodeCoverage( root_id, node_id, true );
                break;
            case "cvg":
                CovergroupLoader.addTab( root_id, node_id, true );
                break;
            case "exc":
                ExpressionLoader.addExpressionTab( root_id, node_id, true );
                break;
            case "cec":
                ExpressionLoader.addConditionTab( root_id, node_id, true );
                break;
            case "toggle":
                ToggleLoader.addTab( root_id, node_id, true );
                break;
            case "assertion":
                AssertionLoader.addTab( root_id, node_id, true );
                break;
            case "path":
                PathLoader.addTab( root_id, node_id, true );
                break;
            case "machine":
                MachineLoader.addTabs( root_id, node_id );
                break;
        }
    },

    /*-----------------------------------------------------------------------*/

    _loadCodeCoverage: function( inst_id, item_id, withSelect )
    {
        var type = $( "#coverage-panel li.ui-tabs-active" ).attr( "aria-controls" ).split( "-" )[ 1 ];
        
        var targetSource = Report.cvg_data[ inst_id ].source_per_item[ item_id ];
        var targetPath = targetSource[ 0 ];
        var targetLine = targetSource[ 1 ];
        
        var tabName = Report._makeTabName( type, inst_id, targetPath );

        if ( tabName in Report.idByName )
        {
            if ( withSelect )
                Report._scrollToLine( Report.idByName[ tabName ], targetLine );
        }
        else
        {
            // Remove all tabs except tab with summary
            while ( Report.ui.content.find( ".ui-tabs-nav li" ).length - 1 )
                Report._removeTab( Report.ui.content.find( ".ui-tabs-nav li:eq(1)" ) );
            
            $.each( Report.cvg_data[ inst_id ].coverage, function( path, lines )
            {
                var tabName = Report._makeTabName( type, inst_id, path );
                var tabNumber = Report._makeTabId();
                
                Report.idByName[ tabName ] = tabNumber;
                Report.nameById[ tabNumber ] = tabName;

                var tabTitle = $( "#coverage-panel li.ui-tabs-active" ).text() + " - ";
                tabTitle += path || "No data";
                
                Report._addTab( tabNumber, tabTitle );
                Report._showCodeCoverage( tabNumber, lines[ type ], path );
                TableDecorator.freezeHeader( $( "#" + tabNumber ).find( "table" ) );
                
                if ( path == targetPath && withSelect )
                    Report._scrollToLine( tabNumber, targetLine );
            } );
        }
    },
        
    /*-----------------------------------------------------------------------*/
    
    _findLastLine: function( coverage )
    {
        var last;
        
        $.each( coverage, function( line )
        {
            line = parseInt( line );
            
            if ( isNaN( line ) )
                return true;
            
            if ( last == undefined || line > last )
                last = line;
        } );
        
        return last;
    },
    
    /*-----------------------------------------------------------------------*/

    _showCodeCoverage: function( tabId, coverage, targetPath )
    {
        if ( $.isEmptyObject( coverage ) )
        {
            $( "#" + tabId ).html( "No coverage data available for selected node." );
            return;
        }
            
        var source = Report.sources[ targetPath ];
        var brush = source ? Report.brushes[ targetPath ] : "sv";
        var last = source ? undefined : Report._findLastLine( coverage );
        var type = Report.nameById[ tabId ].split( "::" )[ 0 ];

        // Coverage has the same structure
        if ( type == "cvg" || type == "exc" || type == "cec" )
            type = "stmt";
        
        var content = "<pre class='brush: " + brush + " '>";
        content += source || Tools.repeatText( "&nbsp;\n", last + 2 ).slice( 0, -2 );
        content += "</pre>";
        $( "#" + tabId ).html( content ).addClass( "code" );
        
        SyntaxHighlighter.highlight( tabId, coverage, type, Tools.escapeHTML( targetPath ) );
        
        if ( CounterManager.isActive() )
            CounterManager.takeOver( $( "#" + tabId ).find( ".gutter + .gutter" ).find( "code" ) );
    },

    /*-----------------------------------------------------------------------*/

    _extractNameFromNode: function( node )
    {
        var copy = node.children( "a" ).clone();
        copy.children().remove(); // Leave text only
        var name = copy.html(); // This method returns escaped string
        var types = $( "#coverage-panel ul.ui-tabs-nav li" ).length;
        return types ? name.split( " : " ).slice( 0, -types ).join( " : " ) : name;
    },

    /*-----------------------------------------------------------------------*/

    _calculateMargins: function()
    {
        var sidebar = $( "#sidebar" );
        var rightMargin = 34;
        var leftMargin = sidebar.length ? 129 : 0;
        var windowInnerWidth = window.innerWidth;
        var sidebarMaxWidth = windowInnerWidth - rightMargin;
        var content = $( "#content" );
        var contentLeftMargin = parseInt( content.css( "left" ) );
        var contentRightMargin = windowInnerWidth - contentLeftMargin;
        
        sidebar.resizable( { maxWidth: sidebarMaxWidth, minWidth: leftMargin } );
        sidebar.css( "max-width", sidebarMaxWidth + "px" ).css( "min-width", leftMargin + "px" );
        
        if ( contentRightMargin < rightMargin )
        {
            var relativeLeftMax = ( ( windowInnerWidth - rightMargin ) / windowInnerWidth * 100 ) + "%",
            relativeSidebarMaxWidth = ( sidebarMaxWidth / windowInnerWidth * 100 ) + "%";
            
            content.css( "left", relativeLeftMax );
            sidebar.css( "width", relativeSidebarMaxWidth );
        }
        else if ( contentLeftMargin < leftMargin )
        {
            var relativeLeftMargin = ( leftMargin / windowInnerWidth * 100 ) + "%";
            
            content.css( "left", relativeLeftMargin );
            sidebar.css( "width", relativeLeftMargin );
        }
    }
};
