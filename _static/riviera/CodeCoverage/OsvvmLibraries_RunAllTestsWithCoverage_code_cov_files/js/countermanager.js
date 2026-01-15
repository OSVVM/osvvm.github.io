var CounterManager = function()
{
    var _tests;
    var _lists;
    
    /*-----------------------------------------------------------------------*/
    
    var _isActive = function()
    {
        return _lists && _lists.length;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _checkTestsFormat = function( array )
    {
        if ( $.isArray( array ) == false )
            return false;

        for ( var i = 0; i < array.length; ++i )
            if ( typeof array[ i ] != "string" )
                return false;

        return true;
    };
    
    /*-----------------------------------------------------------------------*/

    var _checkReferences = function( tests, lists )
    {
        // Not initialized yet
        if ( typeof tests == "undefined" || typeof lists == "undefined" )
            return true;
        
        for ( var i = 0; i < lists.length; ++i )
            if ( Math.max.apply( this, lists[ i ] ) >= tests.length )
                return false;
        
        return true;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _loadTests = function( array )
    {
        if ( _checkTestsFormat( array ) )
            if ( _checkReferences( array, _lists ) )
                _tests = array;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _checkListFormat = function( array )
    {
        if ( $.isArray( array ) == false )
            return false;

        for ( var i = 0; i < array.length; ++i )
            if ( typeof array[ i ] != "number" )
                return false;

        return true;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _checkListsFormat = function( array )
    {
        if ( $.isArray( array ) == false )
            return false;
        
        for ( var i = 0; i < array.length; ++i )
            if ( _checkListFormat( array[ i ] ) == false )
                return false;
        
        return true;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _loadLists = function( array )
    {
        if ( _checkListsFormat( array ) )
            if ( _checkReferences( _tests, array ) )
                _lists = array;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _getTestList = function( index )
    {
        var list = "Covered by test(s):";
        
        $.each( _lists[ index ], function( index, value )
        {
            list += "<br>- ";
            list += _tests[ value ];
        } );
        
        return list;
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _takeOver = function( holder )
    {
        if ( _tests && _tests.length && _lists && _lists.length )
        {
            $( holder ).each( function()
            {
                var holder = $( this );
                var counterAndIndex = holder.text().split( "@" );
                var counter = counterAndIndex[ 0 ];
                var index = counterAndIndex[ 1 ];
                
                if ( index < _lists.length )
                {
                    var excluded = counter.charAt( 0 ) == "(" && counter.charAt( counter.length - 1 ) == ")";
                    counter = excluded ? "(*" + counter.slice( 1 ) : "*" + counter;
                    holder.attr( "title", _getTestList( index ) );
                }
                
                holder.text( counter );
            } );
        }
    };
    
    /*-----------------------------------------------------------------------*/
    
    var _publicInterface =
    {
        isActive: _isActive,
        loadTests: _loadTests,
        loadLists: _loadLists,
        takeOver: _takeOver
    };

    return _publicInterface;
}();
