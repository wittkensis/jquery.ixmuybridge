// Todo: Adapt for resizing events
// Transfer onclick events from this.event onto .ixmuybridge-shiner

;(function ( $, window, document, undefined ) {

    var pluginName = "ixmuybridge",
        defaults = {
            brightness: 1,
            hue: 0.89,
            lightness: 1.0,
            saturation: 0.50,
            angle: -45,
            lighting: "#fff",
            wrapperClassName: "ixmuybridge",
            hoverEl: "el" // Allow for either document or self (for clicking)
        },
        shinerTemplates = [
            "linear-gradient({angle}deg, {lighting} 0%, {lighting} {pos}%, {lighting} 100%)",
            "-webkit-linear-gradient({angle}deg, {lighting} 0%, {lighting} {pos}%, {lighting} 100%)",
            "-moz-linear-gradient({angle}deg, {lighting} 0%, {lighting} {pos}%, {lighting} 100%)"
        ],
        glassId = -1,
        glasses = [],
        shiner = null;

    // Constructor
    function Plugin( element, options ) {
        this.element = element;
        this.glassId = (++glasses.length);
        this.shinerTemplates = shinerTemplates;
        this.options = $.extend( {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        // Trigger
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this.frame();
            // this.updatePos );
            glasses.push({
                glassEl: this.glassEl,
                glassElWrapper: this.glassElWrapper,
                brightness: this.options.brightness,
                hue: this.options.hue,
                lightness: this.options.lightness,
                saturation: this.options.saturation,
                lighting: this.options.lighting
            });
        },
        frame: function() {
            var transferStyles = [ "position", "float", "box-sizing", "z-index", "display", "top", "left", "right", "bottom" ],
                $wrapper = $("<div></div>")
                    .attr('id', 'ixmuybridge-' + this.glassId )
                    .addClass( this.options.wrapperClassName + "-wrapper" );

            // Modify inherited styles to allow for positioning of shiner
            if( $(this.element).css("position") == "static" ) {
                $wrapper.css("position","relative");
            }
            if( $(this.element).css("display") == "inline" ) {
                $wrapper.css("display","inline-block");
            }
            
            $(this.element)
                .wrapAll( $wrapper )
                .data( 'breathe','false' )
                .parent().prepend( "<div class='ixmuybridge-shiner'></div>" );

            // Transfer structural css properties from this.element onto .ixmuybridge-wrapper
            for(var i=0; i<transferStyles.length; i++) {
                if( $(this.element).css(transferStyles[i]).length > 0 ) {
                    $wrapper.css( transferStyles[i], $(this.element).css( transferStyles[i] ) );
                }
            }

            this.shiner = $(".ixmuybridge-wrapper").css({
                height: $(this.element).outerHeight(),
                width: $(this.element).outerWidth()
            });
            
            this.shiner = $(".ixmuybridge-shiner").css({
                height: $(this.element).outerHeight(),
                width: $(this.element).outerWidth(),
                background: "transparent"
            });

            this.options.height = $(this.element).outerHeight();
            this.options.width = $(this.element).outerWidth();

            setInterval(function(){ $('.ixmuybridge').data().plugin_ixmuybridge.updateSize(); },1200);
            setInterval(function(){ $('.ixmuybridge').data().plugin_ixmuybridge.updateNoise(); },700);
        },
        updateNoise: function() {
            var muybridge = $('.ixmuybridge'),
                shiner =    muybridge.data().plugin_ixmuybridge.shiner,
                hsla =      "hsla("+Math.floor((Math.random()*100)+1)+","+35+"%,"+15+"%,0.3)";
                $(shiner).css({background:hsla});
        },
        updateSize: function() {
            var muybridge = $('.ixmuybridge'),
                shiner =    muybridge.data().plugin_ixmuybridge.shiner,
                oH =        muybridge.data().plugin_ixmuybridge.options.height,
                oW =        muybridge.data().plugin_ixmuybridge.options.width,
                img =       shiner.parent().find('img');
            if( img.data('breathe') == 'false' ){
                img.css({width: oW+5+"px"});
                img.data('breathe','true');
            }
            else {
                img.css({width: oW+"px"});
                img.data('breathe','false');
            }
        }
    };

    // Constructor wrapper
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                var plugin = $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
})( jQuery, window, document );