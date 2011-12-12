/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

require(["jquery-1.7.1", "backbone"], function(r) {
    
    
    
    $(function(){
        
       console.log("hello"); 
        
        
    });
    
    
    
    
    var underscr = function(){
        
        
        if(undefined(window.shimmed)){
            return {extend:function(a){}};
        }
        
        
        return window.shimmed;
        
    };
    
    
    underscr().extend("asdasds");
    
    
    
    
    
    
    
    
    var real = {
        
        
        extend:function(a){
            console.log(a);
        }
    };
        
    
    
    window.shimmed = real;
    
    
    underscr.extend("asdasds");
    
    
    
});