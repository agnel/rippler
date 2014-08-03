(function($) {
  "use strict";
  var namespace = 'rippler';
  var methods = {
    init: function(options){      
      options = $.extend({
        effectClass      :  'rippler-effect'
        ,effectSize      :  16      // Default size (width & height)
        ,addElement      :  'div'   // e.g. 'svg' (feature)
        ,duration        :  400
      }, options);

      return this.each(function(){
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);

        if (!data) { 
          options = $.extend({}, options);

          $this.data(namespace, {
            options: options
          });

          $this.on("mousedown." + namespace + " touchstrat." + namespace, function(event) {
            var $self = $(this);  
            methods.effectAdd.call(_this, $self, event);
          });
          $this.on("mouseup." + namespace + " touchend." + namespace, function(event) {
            var $self = $(this);  
            methods.effectStart.call(_this, $self, event);
          });
        }
      }); // end each
    },

    template: function(){
      var $this = $(this);
      var options = $this.data(namespace).options;
      var element;
      var svgElementClass = 'rippler-svg';
      var divElementClass = 'rippler-div';
      var circle = '<circle cx="'+options.effectSize+'" cy="'+options.effectSize+'" r="'+(options.effectSize / 2)+'">';
      var svgElement = '<svg class="'+options.effectClass+' '+svgElementClass+'" xmlns="http://www.w3.org/2000/svg" viewBox="'+(options.effectSize / 2)+' '+(options.effectSize / 2)+' '+options.effectSize+' '+options.effectSize+'">'+circle+'</svg>';

      var divElement = '<div class="'+options.effectClass+' '+divElementClass+'"></div>';

      if (options.addElement === 'svg'){
        element = svgElement;
      } else {
        element = divElement;
      }
      return element;  
    },

    maxWidth : function(){
      var $this = $(this);
      var thisW = $this.outerWidth();
      var thisH = $this.outerHeight();
      var getDiagonal = function(x, y) {
        if (x > 0 && y > 0) return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        else return false;
      }
      return getDiagonal(thisW, thisH) * 2;
    },

    effectAdd: function($self, event){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      $this.append(methods.template.call(_this));

      var $effect = $('.' + options.effectClass);
      var selfOffset = $self.offset();
      var mx = event.pageX;
      var my = event.pageY;

      $effect.css({
        'width':options.effectSize
        ,'height':options.effectSize
        ,'left': ( mx - selfOffset.left ) - ( options.effectSize / 2 )
        ,'top': ( my - selfOffset.top ) - ( options.effectSize / 2 )
        ,'transition':'all '+ ( options.duration / 1000 ) +'s ease-out'
      });
      return _this;
    },

    effectStart : function($self, event){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      var $effect = $('.' + options.effectClass);
      var selfOffset = $self.offset();
      var mx = event.pageX;
      var my = event.pageY;

      var effectMaxWidth = methods.maxWidth.call(_this);

      var rippleScale = function(){
        $effect.css({
          'width':effectMaxWidth
          ,'height':effectMaxWidth
          ,'left': ( mx - selfOffset.left ) - ( effectMaxWidth / 2 )
          ,'top': ( my - selfOffset.top ) - ( effectMaxWidth / 2 )
        });
      }

      var rippleOut = function(){
        $effect.css({
          'opacity': 0
        });
        setTimeout(function(){ 
          $effect.remove();
        }, options.duration);        
      }

      rippleScale();
      setTimeout(rippleOut, options.duration * 1.5);  //*1.5は止めておく時間 

      // return _this;
    },
    
    destroy: function(){
      return this.each(function(){
        var $this = $(this);
        $(window).unbind('.'+namespace);
        $this
          .removeClass(namespace)
          .removeData(namespace);
      });      
    }
    
  };

  $.fn.rippler = function(method){
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.'+namespace);
    }
  };

})(jQuery);