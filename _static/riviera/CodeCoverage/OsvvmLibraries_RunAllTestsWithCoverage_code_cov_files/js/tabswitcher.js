var TabSwitcher = function()
{
    this.ul = null;
    this.butOuterWidth = null;
    this.prevBut = null;
    this.nextBut = null;
    this.firstTab = null;
    this.lastTab = null;
    this.start = 0; // Id of the first visible tab on the left
    this.end = 0; // Id of the first visible tab on the right
    this.count = null;

    /*-----------------------------------------------------------------------*/
                
    this.initialize = function( ulWrapper )
    {
        this.ul = ulWrapper.children( "ul:first" );
        this.ul.find( "li" ).first().css( "marginLeft", "1px" );
        this.ul.wrap( "<div class='ui-tabs-wrapper'></div>" );
        this.ul.after( "<div class='ui-switch-button-bg ui-switch-button-bg-next'></div>" );
        this.ul.next().append( "<button class='ui-switch-button'>&gt;</button>" );
        this.ul.after( "<div class='ui-switch-button-bg ui-switch-button-bg-prev'></div>" );
        this.ul.next().append( "<button class='ui-switch-button'>&lt;</button>" );
        $( ".ui-switch-button" ).button();
        this.ul.parent().css( "background", $( ".ui-widget-header" ).css( "background" ) );
        this.ul.css( "background", "" );

        // save references
        this.wrapper = this.ul.parent();
        this.prevBut = this.wrapper.find( ".ui-switch-button-bg-prev button" );
        this.nextBut = this.wrapper.find( ".ui-switch-button-bg-next button" );
        
        // add values to variables
        this.count = this.ul.children( "li" ).length;
        this.butOuterWidth = this.prevBut.outerWidth();
        
        // bind click action to next and prev buttons(switch-buttons)
        this.prevBut.click( this, this.clickMoveRight );
        this.nextBut.click( this, this.clickMoveLeft );
        
        // Choosing tab should remove focus on other tabs
        ulWrapper.on( "tabsactivate", this.killFocus );
        
        // Rewind tabs if chosen tab is not fully visible
        ulWrapper.on( "tabsactivate", this, this.makeTabVisible );
    };

    /*-----------------------------------------------------------------------*/
    
    this.clickMoveLeft = function( event )
    {
        event.data.moveLeft();
    };
    
    /*-----------------------------------------------------------------------*/

    this.clickMoveRight = function( event )
    {
        event.data.moveRight();
    };
    
    /*-----------------------------------------------------------------------*/

    this.makeTabVisible = function( event )
    {
        var wrapper = $( this ).closest( ".tabs" ).children().first();
        
        var tab = wrapper.find( ".ui-state-focus" );
        tab = tab.length ? tab : wrapper.find( ".ui-state-active" );
        
        var tabIndex = tab.prevAll().length; // 0-based
        var leftClicks = event.data.start - tabIndex;
        var rightClicks = tabIndex - event.data.end;
        
        if ( leftClicks > 0 && rightClicks > 0 )
            return;
        
        for ( var i = 0; i < leftClicks; ++i )
            event.data.moveRight();
        
        for ( var i = 0; i < rightClicks; ++i )
            event.data.moveLeft();
    };
    
    /*-----------------------------------------------------------------------*/

    this.onKeyDown = function( event )
    {
        var focused = $( this ).parent().children().filter( ".ui-state-focus" );
        
        var isLeftArrow = event.keyCode == $.ui.keyCode.LEFT;
        var isRightArrow = event.keyCode == $.ui.keyCode.RIGHT;
        var isHome = event.keyCode == $.ui.keyCode.HOME;
        var isEnd = event.keyCode == $.ui.keyCode.END;
        
        if ( isLeftArrow || isRightArrow || isHome || isEnd )
        {
            var siblings = isLeftArrow || isHome
                ? focused.prevAll()
                : focused.nextAll();
            
            if ( siblings.length )
            {
                focused.removeClass( "ui-state-focus" );
                
                isLeftArrow || isRightArrow
                    ? siblings.first().addClass( "ui-state-focus" )
                    : siblings.last().addClass( "ui-state-focus" );
            }
        }
        
        else if ( event.keyCode == $.ui.keyCode.ENTER || event.keyCode == $.ui.keyCode.SPACE )
            focused.closest( ".tabs" ).tabs( "option", "active", focused.prevAll().length );
    };
    
    /*-----------------------------------------------------------------------*/

    this.killFocus = function( event )
    {
        $( this ).find( ".ui-state-focus" ).removeClass( "ui-state-focus" );
        $( this ).find( ".ui-state-active" ).addClass( "ui-state-focus" );
    };
    
    /*-----------------------------------------------------------------------*/

    this.addLocation = function( event, ui )
    {
        if ( ui == undefined )
        {
            ui = { newTab: this.ul.find( "li" ) };
            
            // Never remove location
            this.ul.parent().parent().off( "tabsbeforeactivate", this.addLocation );
            this.ul.parent().parent().off( "tabsactivate", this.removeLocation );
        }
        
        $.each( ui.newTab, function()
        {
            var anchor = $( this ).find( "a" );
            anchor.attr( "href", "#" + anchor.parent().attr( "aria-controls" ) );
        } );
    };
    
    /*-----------------------------------------------------------------------*/

    this.removeLocation = function( event, ui )
    {
        if ( ui == undefined )
        {
            ui = { newTab: this.ul.find( "li" ) };
            
            // Library need location to be set during tab activation
            this.ul.parent().parent().on( "tabsbeforeactivate", this.addLocation );
            this.ul.parent().parent().on( "tabsactivate", this.removeLocation );
        }
        
        $.each( ui.newTab, function()
        {
            var anchor = $( this ).find( "a" );
            anchor.removeAttr( "href" ).css( "cursor", "pointer" );
        } );
    };
    
    /*-----------------------------------------------------------------------*/

    this.onNewTab = function()
    {
        this.ul.find( "li" ).first().css( "marginLeft", "1px" );
        this.count = this.ul.children( "li" ).length;
        this.firstTab = this.ul.children( "li:first" );
        this.lastTab = this.ul.children( "li:last" );
        this.start = this._getFirstTabId();
        this.end = this._getLastTabId();
        this._refreshButtons();
        this._addTitleAttrToTabs();
        
        // Original handler move focus on tab what cause moving the bar
        this.ul.children( "li" ).off( "keydown" );
        
        // Custom keyboard navigation
        this.ul.children( "li" ).on( "keydown", this.onKeyDown );
        
        // Focus can be moved to not fully visible tab
        this.ul.children( "li" ).on( "keydown", this, this.makeTabVisible );
    };
    
    /*-----------------------------------------------------------------------*/

    this.handleContainerResize = function()
    {
        this.start = this._getFirstTabId();
        this.end = this._getLastTabId();
    
        if ( !this._isFirstTabVisible() && this._isLastTabVisible() )
        {
            var additionalMargin = this.lastTab.offset().left + this.lastTab.outerWidth() - this.nextBut.offset().left;
            var currentMargin = parseInt( this.firstTab.css( "marginLeft" ) );
            var newMargin = currentMargin - additionalMargin - 2;
            newMargin = newMargin > 1 ? 1 : newMargin;
            this.firstTab.css( { "marginLeft": newMargin + "px" } );
        }
        
        this.start = this._getFirstTabId();
        this.end = this._getLastTabId();
        this._refreshButtons();
    };
    
    /*-----------------------------------------------------------------------*/

    this._refreshButtons = function()
    {
        if ( this.count > 1 )
        {
            this.prevBut.button( this._isFirstTabVisible() ? "disable" : "enable" );
            this.nextBut.button( this._isLastTabVisible() ? "disable" : "enable" );
        }
        else
        {
            this.nextBut.button( "disable" );
            this.prevBut.button( "disable" );
        }
    };
    
    /*-----------------------------------------------------------------------*/

    this._addTitleAttrToTabs = function()
    {
        this.ul.children( "li" ).each( function()
        {
            var title = $( this ).find( "a span" ).html();
            $( this ).attr( "title", title );
        } );
    };
    
    /*-----------------------------------------------------------------------*/

    this._isFirstTabVisible = function()
    {
        if ( this.count == 0 )
            return false;
        
        return this.start == 0;
    };
    
    /*-----------------------------------------------------------------------*/

    this._isLastTabVisible = function()
    {
        if ( this.count == 0 )
            return false;
        
        return this.end == this.count - 1;
    };
    
    /*-----------------------------------------------------------------------*/

    this.moveLeft = function()
    {
        // Can be activated during animation
        if ( this.end == this.count - 1 )
            return;
        
        var tabEnd = this.ul.children( "li:eq(" + ( this.end + 1 ) + ")" );

        if ( tabEnd.length == 0 )
            tabEnd = this.lastTab;

        var additionalMargin = tabEnd.offset().left + tabEnd.outerWidth() - this.nextBut.offset().left + 1;
        var currentMargin = parseInt( this.firstTab.css( "marginLeft" ) );
    
        // Preparing for the future
        ++this.end;
        this.start = this._getFirstTabId( -additionalMargin );

        this.firstTab.stop( true ).animate( { "marginLeft": currentMargin - additionalMargin + "px" },
            function( $this )
            {
                return function()
                {
                    $this._refreshButtons();
                };
            }( this ) );
    };
    
    /*-----------------------------------------------------------------------*/

    this.moveRight = function()
    {
        // Can be activated during animation
        if ( this.start == 0 )
            return;
        
        var tabStart = this.ul.children( "li:eq(" + ( this.start - 1 ) + ")" );

        if ( tabStart.length == 0 ) 
            tabStart = this.firstTab;

        var additionalMargin = this.wrapper.offset().left + this.butOuterWidth + 1 - tabStart.offset().left;
        var currentMargin = parseInt( this.firstTab.css( "marginLeft" ) );
        
        // Preparing for the future
        --this.start;
        this.end = this._getLastTabId( additionalMargin );
        
        this.firstTab.stop( true ).animate( { "marginLeft": currentMargin + additionalMargin + "px" },
            function( $this )
            {
                return function()
                {
                    $this._refreshButtons();
                };
            }( this ) );
    };
    
    /*-----------------------------------------------------------------------*/

    this._getLastTabId = function( offset )
    {
        if ( !offset )
            offset = 0;
        
        var insideRightBorder = -1;
        
        this.ul.children( "li" ).each( function()
        {
            var rightButton = $( this ).parent().next().next().children()[ 0 ];
            
            if ( this.getBoundingClientRect().right + offset < rightButton.getBoundingClientRect().left )
                ++insideRightBorder;
        } );
        
        return insideRightBorder;
    };
    
    /*-----------------------------------------------------------------------*/

    this._getFirstTabId = function( offset )
    {
        if ( !offset )
            offset = 0;
        
        var outsideLeftBorder = 0;
        
        this.ul.children( "li" ).each( function()
        {
            var leftButton = $( this ).parent().next().children()[ 0 ];
            
            if ( this.getBoundingClientRect().left + offset <= leftButton.getBoundingClientRect().right )
                ++outsideLeftBorder;
        } );
        
        return outsideLeftBorder;
    };
};
