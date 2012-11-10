var FeedCollection = Backbone.Collection.extend({

	model:Backbone.Model.extend({

		initialize:function(models, attr){
			this.date = new Date(this.get("created_time"));
			this.timestring = this.date.getTime();
		}

	}),

	initialize:function(models, para){


		var tmpFunc = _.template("https://graph.facebook.com/<%=actor%>/posts?limit=100&access_token=<%=token%>");

		this.nextPage = tmpFunc({actor:para.actorId, token:para.accessToken});
	},


	url:function(){
		return this.nextPage;
	},


	parse:function(resp){
		this.nextPage = resp.paging.next;
		return resp.data;
	},


	filterByPrivacyDescription:function(description){
		return this.filter(function(item){
			return item.get("privacy") && item.get("privacy").description == description;
		});
	},

	groupByPrivacyDescription:function(){

		return this.groupBy(function(item){

			var prv = item.get("privacy");

			return prv != null ? prv.description : "None";

		});

	}

});