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
        this.velocity = 0;
        this.offset = 0;
        this.running = true;
        this.acceleration = this.startAcceleration;
    },
    
    
    stop:function(){
        this.running = true;
        this.acceleration = this.startDecceleration;
    },
    
    
    kill:function(){
      this.running = false;
      this.trigger("killed");
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
   
  
  
  var TumblerCollection = Backbone.Collection.extend({
    model:Backbone.Model.extend({}),
    
    initialize:function(){
      this.refresh(window.tumbleData.sets);
    }
  })
  
  
  
  var MainView = Backbone.View.extend({
    
    tumblers:[],
    
    initialize:function(){
      this.collection.bind("refresh", this.render, this);
      this.render();
    },
    
    render:function(){
      
      var json = this.collection.toJSON();
      
      var template = $("#view-template").html();
        
      this.el.innerHTML = _.template(template, {data:json});
      
      
      var self = this;
      
      $(this.el).find("div").each(function(i, el){
        self.tumblers[i] = new TumblerView({el:el});
      });
      
      var len = this.tumblers.length;
      
      this.tumblers[len-1].bind("killed", function(){
        self.trigger("end");
      });
    },
    
    getTumblerValues:function(){
      
      var values = [];
      
      
      $(this.el).find("div ul").each(function(i, el){
        
        var li = $(this).find("li:eq(2)");
        values[i] = li.text();
      });
      
      return values;
    },
    
    
    tumble:function(){
      
      var len = this.tumblers.length;
      var self = this;
      $.each(this.tumblers, function(i,el){
    
        var startTime = i * 480;
        var endTime = 900;
        
        setTimeout(function(){
          el.start()
          
          setTimeout(function(){
            el.stop();
          }, endTime);
          
        }, startTime)
      });
      
    }
    
    
  });
  
  
  var view = new MainView({collection:new TumblerCollection(), el:$("#spinner")[0]});
  
  
  var Panel = Backbone.View.extend({
    
    disp:view,
    
    events:{
      "click a":"respin"
    },
    
    
    initialize:function(){
      
      var self = this;
      
      this.disp.bind("end", function(){
        self.render();
      });
      
      this.disp.tumble();
    },
    
    
    render:function(){
      
      this.el.innerHTML = _.template(window.tumbleData.template, {data:this.disp.getTumblerValues()});
    },
    
    respin:function(e){
      
      this.disp.tumble();
      return false;
    }
    
    
  });
  
  
  var panel = new Panel({disp:view, el:$("#panel")[0]});
  

  
  
  
})(jQuery);