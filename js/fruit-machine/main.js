(function($){
  
  
  
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  
  
  var liHeight = 18;
  var list = $("#tech");
  
  var liCount = list.find("li").length;
  
  
  var Tumbler = _.extend({
    
    
    velocity:0,
    acceleration:0,
    startAcceleration:0.2,
    startDecceleration:-0.02,
    maxHeight:liHeight,
    clampVelocity:30,
    
    offset:0,
    
    update:function(timestamp){
        
        this.velocity += this.acceleration;
        
        //clamp
        this.velocity = this.velocity > this.clampVelocity ? this.clampVelocity : (this.velocity > 0 ? this.velocity : 0);
        
        this.offset += this.velocity;
        
        if(this.offset > this.maxHeight){
            this.offset -= this.maxHeight;
            this.trigger("swap");
        }
        
        
        this.trigger("update", this.offset);
        
        return this.velocity != 0;
    },
    
    
    start:function(){
        
        this.acceleration = this.startAcceleration;
        this.bindAnimationFrame();
    },
    
    bindAnimationFrame:function(){
        
        var self = this;
        
        window.requestAnimationFrame(function(timestamp){
            if(self.update(timestamp)){
                self.bindAnimationFrame();
            }else{
                self.kill();
            }
        });
    },
    
    
    stop:function(){
        console.log("stop");
        this.acceleration = this.startDecceleration;
        this.bindAnimationFrame();
    },
    
    
    kill:function(){
        window.requestAnimationFrame(function(timestamp){});
    }
    
  }, Backbone.Events);
  
  
  
  
  Tumbler.bind("update", function(offset){
    list.css({"top":offset+"px"});
  });
  
  Tumbler.bind("swap", function(){
    var liItem = list.find("li:last").detach();
        list.prepend(liItem);
  });
  
  Tumbler.start();
  
  setTimeout(function(){ Tumbler.stop(); }, 900);
  
  
})(jQuery);