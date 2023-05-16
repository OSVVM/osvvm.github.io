var Tools = function()
{
    var _specialCharacters =
    {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    
    /*-----------------------------------------------------------------------*/

    var _isTransparent = function( element )
    {
        var color = $( element ).css( "background-color" );
        return color == "transparent" || color == "rgba(0, 0, 0, 0)";
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _makeColorExplicit = function( element )
    {
        $( element ).each( function()
        {
            var element = $( this );
        
            if ( !_isTransparent( element ) )
                return;
        
            var ancestor = element.parent();
        
            while ( _isTransparent( ancestor ) )
            {
                ancestor = ancestor.parent();
            
                if ( ancestor == document )
                    return;
            }

            element.css( "background-color", ancestor.css( "background-color" ) );
        } );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _wrapNumbersInBrackets = function( text )
    {
        return text.replace( /\d+/g, "($&)" );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _escapeHTML = function( string )
    {
        return String( string ).replace( /[&<>"'\/]/g, function( s )
        {
            return _specialCharacters[ s ];
        } );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _forceWhiteSpaces = function( string )
    {
        return string.replace( /\n/g, "<br />" )
                     .replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _repeatText = function( text, count )
    {
        var result = "";
        
        // Can be optimized
        for ( var i = 0; i < count; ++i )
            result += text;
        
        return result;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _getFirstDescendant = function( root, selector )
    {
        var result = [];
        
        $( root ).each( function()
        {
            var descendant = this.querySelector( selector );
            
            if ( descendant !== null )
            {
                result.push( descendant );
                return false;
            }
        } );
        
        return $( result );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _getAllDescendants = function( root, selector )
    {
        var result = [];
        
        $( root ).each( function()
        {
            var descendants = this.querySelectorAll( selector );
            
            for ( var i = 0; i < descendants.length; ++i )
                result.push( descendants[ i ] );
        } );
        
        return $( result );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _getTreeNodeParents = function( root, node )
    {
        if ( root.id == node )
            return [];
        
        if ( root.children )
        {
            for ( var i = 0; i < root.children.length; ++i )
            {
                var result = _getTreeNodeParents( root.children[ i ], node );
                
                if ( typeof result == "object" )
                {
                    result.push( root.id );
                    return result;
                }
            }
        }
        
        return undefined;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _setImportantStyle = function( nodes, name, value )
    {
        nodes = $( nodes );
        
        nodes.each( function()
        {
            var node = $( this );
            node.css( name, "" );

            var oldStyle = node.attr( "style" ) || "";
            oldStyle += oldStyle != "" && oldStyle.slice( -1 ) != ";" ? ";" : "";
            node.attr( "style", oldStyle + name + ":" + value + "!important" );
        } );
    };

    /*-----------------------------------------------------------------------*/

    var _scrollTo = function( element )
    {
        element = $( element ).last();
        element[ 0 ].scrollIntoView();
        element.closest( ".ui-tabs-panel" ).scrollLeft( 0 );
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _publicInterface =
    {
        isTransparent: _isTransparent,
        makeColorExplicit: _makeColorExplicit,
        wrapNumbersInBrackets: _wrapNumbersInBrackets,
        escapeHTML: _escapeHTML,
        forceWhiteSpaces: _forceWhiteSpaces,
        repeatText: _repeatText,
        getFirstDescendant: _getFirstDescendant,
        getAllDescendants: _getAllDescendants,
        getTreeNodeParents: _getTreeNodeParents,
        setImportantStyle: _setImportantStyle,
        scrollTo: _scrollTo
    };
    
    return _publicInterface;
}();
