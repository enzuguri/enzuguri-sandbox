(function($){
  	
	var UMLParser = {
		
		
		parseJSON:function(json){
			
			var str = "<table>";
			
			var template = "<tr><td><%= name %></td></tr>";
					
			for(var p in json){
				
				var obj = {name:p};
				
				str += _.template(template, obj);
				
			}
			
			
			str += "</table>";
			
			
			return str;
		}
		
		
	}


  	var FormView = Backbone.View.extend({
		
		el:$("#main")[0],
		
		getJSONField:function(){
			return $(this.el).find("#json");
		},
		
		events:{
			"click #parse":"onParse"
		},
		
		onParse:function(e){
			
			var jsonVal = this.getJSONField().val();
			
			console.log(jsonVal);
			
			try{
				var jsonObj = JSON.parse(jsonVal);
				var result = UMLParser.parseJSON(jsonObj);
				console.log(result);
			}catch(err){
				console.log(err);
			}
		}
		
	
	
	});
	
	var mainView = new FormView();
    
  
})(jQuery);