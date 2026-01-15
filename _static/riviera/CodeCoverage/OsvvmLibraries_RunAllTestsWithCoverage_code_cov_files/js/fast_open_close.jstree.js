( function ( $, undefined )
{
    "use strict";

    $.jstree.plugins.fast_open_close = function ( options, parent )
    {
        this.fast_open_all = function ()
        {
            this._fast_toggle( "#", true );
            this.redraw( true );
        };
        
        this.fast_open_branch = function ( node_id )
        {
            this._fast_toggle( node_id, true );
            this.redraw( true );
        };
        
        this.fast_close_all = function ()
        {
            this._fast_toggle( "#", 0 );
            this.redraw( true );
        };
        
        this.fast_close_branch = function ( node_id )
        {
            this._fast_toggle( node_id, 0 );
            this.redraw( true );
        };
        
        this._fast_toggle = function ( node_id, opened )
        {
            var node = this._model.data[ node_id ], i;
            
            if ( node_id != "#" )
                node.state.opened = node.children.length ? opened : false;
            
            for ( i in node.children )
                this._fast_toggle( node.children[ i ], opened );
        };
    };
} )( jQuery );