var TableDecorator = function()
{
    var _views = {};
    
    /*-----------------------------------------------------------------------*/
    
    var _switchBackground = function( e )
    {
        var row = $( this );
        
        if ( Tools.getFirstDescendant( row, "th" ).length )
            return;
        
        // Explicit background color can override value from the class and should be cleared
        if ( e.type == "mouseenter" )
            if ( Tools.isTransparent( row ) )
                row.addClass( "jstree-clicked" ).css( "background-color", "" );
        
        // Force redraw on some broken browsers by simulating background color change
        if ( e.type == "mouseleave" )
            if ( row.hasClass( "jstree-clicked" ) )
                row.removeClass( "jstree-clicked" ).css( "background-color", "transparent" );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _addHighlighting = function( table )
    {
        table = $( table );
        table.addClass( "jstree-default" );
        table.delegate( "tr", "mouseenter mouseleave", _switchBackground );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _showRow = function()
    {
        this.style.display = "table-row";
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _expandAll = function( row )
    {
        row = row.reference == undefined ? row : row.reference;
        var table = row.closest( "table" );
        var closed = Tools.getAllDescendants( table, ".toggle-closed" );
        
        if ( closed.length == 0 )
            return;
        
        closed.removeClass( "toggle-closed" ).addClass( "toggle-opened" );
        Tools.getAllDescendants( table, "tr" ).each( _showRow );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _findChildren = function( row, recursive )
    {
        row = row.reference == undefined ? row : row.reference;
        var child = row.next();
        
        if ( child.length == 0 )
            return $();
        
        var padding = parseInt( Tools.getFirstDescendant( row, "td" ).css( "padding-left" ) );
        var childPadding = parseInt( Tools.getFirstDescendant( child, "td" ).css( "padding-left" ) );
        
        if ( childPadding <= padding )
            return $();
        
        var result = [];
        
        row.nextAll().each( function()
        {
            var rowBelow = $( this );
            var paddingBelow = parseInt( Tools.getFirstDescendant( rowBelow, "td" ).css( "padding-left" ) );
            
            if ( paddingBelow < childPadding )
                return false;
            
            if ( recursive || paddingBelow == childPadding )
                result.push( this );
        } );
        
        return $( result );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _expandSelected = function( row )
    {
        row = row.reference == undefined ? row : row.reference;
        var nodes = _findChildren( row, true );
        var closed = Tools.getAllDescendants( nodes.add( row ), ".toggle-closed" );
        closed.removeClass( "toggle-closed" ).addClass( "toggle-opened" );
        nodes.each( _showRow );
    };
  
    /*-----------------------------------------------------------------------*/
    
    var _hideRow = function()
    {
        this.style.display = "none";
    };
  
    /*-----------------------------------------------------------------------*/
    
    var _collapseAll = function( row )
    {
        row = row.reference == undefined ? row : row.reference;
        var table = row.closest( "table" );
        var opened = Tools.getAllDescendants( table, ".toggle-opened" );
        
        if ( opened.length == 0 )
            return;
        
        var headers = Tools.getAllDescendants( table, "th" ).parent();
        var nodes = Tools.getAllDescendants( table, "tr" ).not( headers );
        var padding = parseInt( Tools.getFirstDescendant( nodes.first(), "td" ).css( "padding-left" ) );
        
        opened.removeClass( "toggle-opened" ).addClass( "toggle-closed" );
        
        nodes.hide().each( function()
        {
            var currentPadding = parseInt( Tools.getFirstDescendant( this, "td" ).css( "padding-left" ) );
            
            if ( currentPadding == padding )
                _showRow.call( this );
        } );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _collapseSelected = function( row )
    {
        row = row.reference == undefined ? row : row.reference;
        var nodes = _findChildren( row, true );
        var opened = Tools.getAllDescendants( nodes.add( row ), ".toggle-opened" );
        opened.removeClass( "toggle-opened" ).addClass( "toggle-closed" );
        nodes.each( _hideRow );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _showMenu = function( e )
    {
        var menu =
        {
            expand_all: { label: "Expand All", action: _expandAll },
            expand: { label: "Expand Selected", action: _expandSelected },
            collapse_all: { label: "Collapse All", action: _collapseAll },
            collapse: { label: "Collapse Selected", action: _collapseSelected }
        };
    
        e.preventDefault();
        $.vakata.context.show( $( this ), { x: e.pageX, y: e.pageY }, menu );
        $( ".vakata-context" ).addClass( "jstree-default-context jstree-contextmenu jstree-default-contextmenu" );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _getParent = function( row )
    {
        var padding = parseInt( Tools.getFirstDescendant( row, "td" ).css( "padding-left" ) );
        
        for ( var rowAbove = row.prev(); rowAbove.length; rowAbove = rowAbove.prev() )
            if ( parseInt( Tools.getFirstDescendant( rowAbove, "td" ).css( "padding-left" ) ) < padding )
                return rowAbove;
        
        return $();
    };
    
    /*-----------------------------------------------------------------------*/

    var _isVisible = function( row )
    {
        var parent = _getParent( row );

        if ( parent.length == 0 )
            return true;

        if ( Tools.getFirstDescendant( parent, ".toggle-opened" ).length == 0 )
            return false;

        return _isVisible( parent );
    };

    /*-----------------------------------------------------------------------*/
    
    var _switchNode = function()
    {
        var span = $( this );
        var row = span.parent().parent();
        
        if ( span.hasClass( "toggle-closed" ) )
        {
            span.removeClass( "toggle-closed" ).addClass( "toggle-opened" );

            if ( _isVisible( row ) )
            {
                var children = _findChildren( row, false );
                var opened = Tools.getAllDescendants( children, ".toggle-opened" );
                opened.removeClass( "toggle-opened" ).addClass( "toggle-closed" );
                opened.click();
                children.each( _showRow );
            }
        }
        else if ( span.hasClass( "toggle-opened" ) )
        {
            _findChildren( row, true ).each( _hideRow );
            span.removeClass( "toggle-opened" ).addClass( "toggle-closed" );
        }
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _addExpanding = function( table, expand )
    {
        var headers = Tools.getAllDescendants( table, "th" ).parent();
        var nodes = Tools.getAllDescendants( table, "tr" ).not( headers );
        var padding = parseInt( Tools.getFirstDescendant( nodes.first(), "td" ).css( "padding-left" ) );
        
        nodes.each( function()
        {
            var currentRow = $( this );
            var currentCell = Tools.getFirstDescendant( currentRow, "td" );
            var currentPadding = parseInt( currentCell.css( "padding-left" ) );
            
            currentPadding > padding && !expand ? _hideRow.call( this ) : _showRow.call( this );
            currentCell.prepend( "<span></span>" );
            currentCell.css( "white-space", "nowrap" );
            currentRow.bind( "contextmenu", _showMenu );
            
            var currentIcon = Tools.getFirstDescendant( currentCell, "span" );
            var rowBelow = currentRow.next();
            
            if ( rowBelow.length == 0 )
                currentIcon.addClass( "toggle-static-last" );
            
            else
            {
                var paddingBelow = parseInt( Tools.getFirstDescendant( rowBelow, "td" ).css( "padding-left" ) );
                
                if ( paddingBelow > currentPadding )
                    currentIcon.addClass( "toggle-" + ( expand ? "opened" : "closed" ) ).click( _switchNode );
                else if ( paddingBelow == currentPadding )
                    currentIcon.addClass( "toggle-static" );
                else
                    currentIcon.addClass( "toggle-static-last" );
            }
        } );
    };

    /*-----------------------------------------------------------------------*/
    
    var _expandTo = function( row )
    {
        row = $( row );
        
        if ( row.css( "display" ) != "none" )
            return;
        
        if ( row.closest( "table" ).has( ".toggle-static-last" ).length == 0 )
            return;
        
        for ( var parent = _getParent( row ); parent.length; parent = _getParent( parent ) )
            Tools.getFirstDescendant( parent, "span.toggle-closed" ).click();
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _saveView = function( name, table )
    {
        var opened = [ true ];
        var closed = [ false ];
        
        Tools.getAllDescendants( table, "tr" ).each( function( index )
        {
            if ( Tools.getFirstDescendant( this, ".toggle-opened" ).length )
                opened.push( index );
            else if ( Tools.getFirstDescendant( this, ".toggle-closed" ).length )
                closed.push( index );
        } );
        
        _views[ name ] = closed.length < opened.length ? closed : opened;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _loadView = function( name, table )
    {
        var rows = Tools.getAllDescendants( table, "tr" );
        
        $.each( _views[ name ] || [], function( index, value )
        {
            if ( index == 0 )
            {
                if ( value === false )
                    _expandAll( rows.first() );
                else if ( value === true )
                    _collapseAll( rows.first() );
            }
            else
                _switchNode.call( Tools.getFirstDescendant( rows.eq( value ), "span" ) );
        } );
    };

    /*-----------------------------------------------------------------------*/

    var _refreshHeaders = function()
    {
        // Call this function if table width changed

        $( ".header" ).each( function()
        {
            // Skip hidden tables
            if ( this.getBoundingClientRect().right == 0 )
                return;

            var header = $( this );
            var headerParent = header.parent();
            var table = headerParent.prev();
            var tableParent = table.parent();

            var tableParentSize = tableParent[ 0 ].getBoundingClientRect();
            var scrollWidth = tableParent[ 0 ].offsetWidth - tableParent[ 0 ].clientWidth;
            
            Tools.setImportantStyle( headerParent, "width", tableParentSize.width - scrollWidth + "px" );
            Tools.setImportantStyle( headerParent, "top", tableParentSize.top + "px" );
            Tools.setImportantStyle( headerParent, "left", tableParentSize.left + "px" );
            Tools.setImportantStyle( header, "width", table[ 0 ].getBoundingClientRect().width + "px" );

            var headerCells = header.find( "tr" ).first().find( "th" );
            var tableCells = table.find( "th" );
        
            for ( var i = 0; i < headerCells.length; ++i )
                Tools.setImportantStyle( headerCells.eq( i ), "width", tableCells.eq( i ).css( "width" ) );
        } );
    };

    /*-----------------------------------------------------------------------*/

    var _freezeHeader = function( table )
    {
        var header = table.clone();

        Tools.getFirstDescendant( header, "td" ).parent().next().addBack().remove();
        header.addClass( "header" );
        header.wrap( "<div></div>" );
        Tools.setImportantStyle( header.parent(), "position", "fixed" );
        Tools.setImportantStyle( header.parent(), "overflow", "hidden" );
        table.after( header.parent() );
        Tools.makeColorExplicit( header );

        table.parent().on( "scroll", function()
        {
            header.parent().scrollLeft( $( this ).scrollLeft() );
        } );

        _refreshHeaders();
    };

    /*-----------------------------------------------------------------------*/
    
    var _publicInterface =
    {
        addHighlighting: _addHighlighting,
        addExpanding: _addExpanding,
        expandTo: _expandTo,
        saveView: _saveView,
        loadView: _loadView,        
        refreshHeaders: _refreshHeaders,
        freezeHeader: _freezeHeader
    };
    
    return _publicInterface;
}();
