var teaData = [{count:2, teas:[]},
               {count:20, teas:[]}, null, null,null, null,
               {count:12, teas:[]}, null, null, null, null, null];



function generateTeaDrinkers() {
                
        for(var i = 0; i < teaData.length; i++) {
                if(teaData[i]) {
                        
                        var data = teaData[i];
                        var count = data.count;
                        
                        for(var j = 0; j < count; j++) {
                                data.teas[j] = generateTeaDrinker();
                        }
                        
                }
        }
        
        
}


function generateTeaDrinker() {

        var names = ["Alex", "Jon", "Kev", "Steve", "James", "Jolyon"];
        
        var sugar = Math.random() > 0.5;
        var type = Math.random() > 0.5 ? "white" : "black";
        
        return {name:names[Math.floor(Math.random() * names.length)], sugar:sugar, type:type}
}

function updateTeas() {
        
        $("#teaForm input").val(null);
        $("#teaForm ul").remove();
        
        if($.teaIndex > -1) {
                var teas = teaData[$.teaIndex];
                
                var time = $.teaIndex + 15;
                if(time >= 20) {
                        time -= 12;
                }
                
                $("#teaForm input[name=time]").val(time + ":00");
                
                if(teas != null) {
                        $("#teaForm input[name=count]").val(teas.count);
                        
                        var $ul = $("<ul/>");
                        
                        var peeps = teas.teas;
                        
                        var template = "<li><span class='name'>{{name}}</span>, drunk a <span class='tea'>{{type}}</span> tea, with sugar? <span class='sugar'>{{sugar}}</span></li>";
                        
                        for(var i = 0; i < peeps.length; i++) {
                            $ul.append(Mustache.to_html(template, peeps[i]));    
                        }
                        
                        $("#teaForm").append($ul);
                }
        } 
        
}




$(function() {


$g('clock').size(640, 480).play(1);

generateTeaDrinkers();

$.teaIndex = -1;

$g("clock").add("slice", {
        radius:150,
        color: "#8ba79f",
        mouseX:0,
        mouseY:0,
        mouseAngle:0,
        offsetX:40,
        offsetY:40,
        move:false,
        draw: function(ctx) {
            this.paint(ctx);
        },
        
        
        paint:function(ctx){
                       
            var slices = 12;

            var ang = (Math.PI*2) / slices;
            
            ctx.translate(this.radius + this.offsetX, this.radius + this.offsetY);
            
            ctx.lineWidth = 0;
                        
            var now;
            
            for(var i = 0; i < slices; i++)
            {
                now = i * ang;
                
                ctx.beginPath();
                        
                ctx.moveTo(0,0);
                ctx.lineTo(Math.cos(now) * this.radius, Math.sin(now) * this.radius);
                ctx.lineTo(Math.cos(now+ang) * this.radius, Math.sin(now+ang) * this.radius);
                ctx.lineTo(0,0);
                
                if(this.move){
                    
                    if(this.mouseAngle > now && this.mouseAngle < now+ang){
                        ctx.fillStyle = "#945630";
                        
                        if(i != $.teaIndex) {
                                $.teaIndex = i;
                                updateTeas();
                        }
                        
                    }else {
                        ctx.fillStyle = this.color; 
                    }
                }else{
                        ctx.fillStyle = this.color;
                }
                
                ctx.fill();
                
                
                var middle = now + ang/2;
                
                if(teaData[i] != null) {
                        
                        var count = teaData[i].count;
                        
                        var teaRadius = count/20 * 20;
                        
                        var centerX = Math.cos(middle) * (this.radius + teaRadius);
                        var centerY = Math.sin(middle) * (this.radius + teaRadius);
                        ctx.fillStyle = "#662f1c";
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, teaRadius, 0, 2 * Math.PI, false);
                        ctx.fill();
                }
                
            }
            
            
            
            
            if(this.move)
            {
                
                $("#canvasControls input:text").val(this.mouseAngle);
                
                ctx.beginPath();
                ctx.strokeStyle = "#00";
                
                
                ctx.moveTo(0,0);
                
                ctx.lineWidth = 2;
                ctx.lineTo(this.mouseX -this.radius - this.offsetX, this.mouseY - this.radius - this.offsetY);
                ctx.stroke();
                ctx.closePath();
            } else if($.teaIndex != -1) {
                $.teaIndex = -1;
                updateTeas();
            }
            
            ctx.restore();
            
            
            ctx.translate(-(this.radius + this.offsetX),-(this.radius + this.offsetY));
        }
        
        
      }).mousemove("slice", function(e){
            
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            
                var dy = (this.mouseY - this.radius - this.offsetX);
                var dx = (this.mouseX - this.radius - this.offsetY);
                    
                this.mouseAngle = Math.atan2(dy , dx);
                
                if(this.mouseAngle < 0) this.mouseAngle += Math.PI*2;
            
            
            
        }).mouseenter("slice", function(e){
                this.move = true;
                //this.color = "#005d49";
        }).mouseleave("slice", function(e){
                this.move = false;
                //this.color = "#8ba79f";
})



});