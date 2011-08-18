require(["https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js",
         "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js"],
        function() {
        //This function is called when scripts/helper/util.js is loaded.

        require.ready(function() {
        
        
        
        //$("#drag").draggable();
        
        
        
        
        var control = {
            
            element:null,
            outerElement:null,
            innerElement:null,
            container:null,
            
            value:0.1,
            
            
            
            _create : function(){
                
            this.outerElement = $("<div/>").attr({id:"ui-outer"});
            this.innerElement = $("<div/>").attr({id:"ui-inner"});
            
            
            this.container = $("<div class='ui-container'/>").appendTo(this.element);
        
            this.container.append(this.outerElement);
            this.container.append(this.innerElement);
            
            var self = this;
                
            this.container.bind('mousedown', function(e){
               

               
               self.calculateFromMouse(e);
               
               $(this).bind("mousemove", function(e){
               
                self.calculateFromMouse(e);    
                 
               }).bind("mouseleave mouseup", function(e){
                    self.container.unbind("mousemove mouseleave mouseup");
               });
                
            });
            
                        
            this.updateDisplay();
                
            },
            
            calculateFromMouse:function(e){
                
                
                
                var w = this.container.width() / 2;
                var h = this.container.height() / 2;
                
                var pos = this.container.position();
                
                var mx = e.pageX - pos.top;
                var my = e.pageY - pos.left;
                
                
                var x = mx - w;
                var y = my - h;
                
                console.log(mx + ":" + my);
                
                var dx = w - x;
                var dy = w - y;
                
                var dist = Math.sqrt((dx * dx) + (dy * dy));
                
                var maxDist = Math.sqrt((w*w) + (h*h));
                
                
                //console.log(e);
                
                this.setValue(Math.abs(dist) / maxDist);
            },
            
            
            
            
            setValue:function(change){
                
                if(change != this.value){
                    this.value = change;    
                    this.updateDisplay();
                    this.triggerChangeEvent();
                }
            },
            
            
            
            updateDisplay:function(){
                
                var perc = this.value * 100;
                
                
                var w = this.container.width();
                var h = this.container.height();
                
                
                var nW = w * this.value;
                var nH = h * this.value;
                
                var posX = (w - nW) / 2;
                var posY = (h - nH) / 2;
                
                
                this.innerElement.css({width:nW + "px",
                                       height:nH + "px",
                                       top:posY,
                                       left:posX});
                
            },
            
            
            
            triggerChangeEvent:function(){
                
            },
            
            
            
            
            
            
            destroy: function() {
                this.element.remove(this.outerElement);
                this.element.remove(this.innerElement);
                
                
            },
            
            
            
            
            quick:function($element){
                
                this.element = $element;
                this._create();
                
            }
            
            
        }
        
        control.quick($("#drag"));
        
        
        
        
    });
});