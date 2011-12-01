(function($){
  
  
  
  var frameBeacon = _.extend({
    
    
    activate:function(){
      var self = this;
      
      window.requestAnimationFrame(function(timestamp){
        self.trigger("enterFrame", timestamp);
        self.activate();
      });
    },
    
    initialize:function(){
      
      //bind frame
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      
      this.activate();
    }
    
  }, Backbone.Events);
  

  frameBeacon.initialize();
  
 
  
  
  var TumblerView = Backbone.View.extend({
    
    beacon:frameBeacon,
    velocity:0,
    acceleration:0,
    startAcceleration:0.2,
    startDecceleration:-0.04,
    maxHeight:0,
    clampVelocity:30,
    
    offset:0,
    el:null,
    list:null,
    distance:0,
    
    updateFunc:null,
    running:false,
    
    initialize:function(){
      
      
      this.list = $(this.el).find("ul");
      
      //set maxHeight
      this.maxHeight = this.list.find("li:first").height();
      
      var self = this;
      this.updateFunc = function(timestamp){
        self.update(timestamp);
      }
      
      
      this.beacon.bind("enterFrame", this.updateFunc);
    },
    
    
    start:function(distance){
        this.running = true;
        this.acceleration = this.startAcceleration;
    },
    
    
    stop:function(){
        this.running = true;
        this.acceleration = this.startDecceleration;
    },
    
    
    kill:function(){
      this.running = false;
      //this.beacon.unbind("enterFrame", this.updateFunc);
      this.list.css({"top":-this.maxHeight+"px"});
    },
    
    update:function(timestamp){
        
        if(this.running == false){
          
          return false;
        }
        
        
                
        
        this.velocity += this.acceleration;
        
        //clamp
        this.velocity = this.velocity > this.clampVelocity ? this.clampVelocity : (this.velocity > 0 ? this.velocity : 0);
        
        
        
        this.offset += this.velocity;
        
        if(this.offset > this.maxHeight){
            this.offset -= this.maxHeight;
            this.swapLastForFirst();
        }
        
        
        var speedTest = this.velocity > 0;
        
        if(!speedTest){
          this.kill();
          
          
          if(this.offset > this.maxHeight/2){
            this.swapLastForFirst();
          }
          
          this.offset = 0;
          
        }
        
        if(this.running == true){
          this.list.css({"top":this.offset-this.maxHeight+"px"});
        }
        
        return speedTest;
    },
    
    
    swapLastForFirst:function(){
      var liItem = this.list.find("li:last").detach();
      this.list.prepend(liItem);
    }
    
    
  });
  

  var techTumblr = new TumblerView({el:$("#tech")[0]});
  var brandTumblr = new TumblerView({el:$("#brand")[0]});
  var marketTumblr = new TumblerView({el:$("#market")[0]});
  
  var tumblers = [techTumblr,brandTumblr,marketTumblr];
  
  
  $.each(tumblers, function(i,el){
    
    var startTime = i * 480;
    var endTime = 900;
    
    setTimeout(function(){
      el.start()
      
      setTimeout(function(){
        el.stop();
      }, endTime);
      
    }, startTime)
  });
  
  
})(jQuery);