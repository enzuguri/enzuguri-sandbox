window.FeedModel = Backbone.Collection.extend({

            initialize:function(para){
                this.accessToken = para.accessToken;
                this.actorId = para.actorId;
            },

            url:function(){

                var base = "https://graph.facebook.com/fql?access_token=<%=accessToken%>&q=SELECT <%=types%> FROM stream WHERE actor_id = <%=actorId%> and source_id = <%=actorId%> and strpos(privacy.description,'<%=country%>') >=0 limit <%=limit%>";

                var options = {
                    types:"message, type, actor_id, action_links, attachment, privacy, post_id, created_time, updated_time",
                    accessToken:this.accessToken,
                    actorId:this.actorId,
                    country:this.selectedMarket,
                    limit:100
                }

                

                return _.template(base, options);

            },
            selectedMarket:"Public",

            parse:function(data){

                _.each(data.data, function(item){

                    this.parseType(item);

                }, this);



                return data.data;
            },


            parseType:function(item){
                var types = {
                    "12":"Event",
                    "46":"Status",
                    "80":"link",
                    "128":"Video",
                    "247":"photo",
                    "237":"App story"
                }

                if(item.type == 237){
                    var firstMedia = item.attachment.media[0];

                    switch(firstMedia.type){
                        case "swf":
                            item.picture = firstMedia.src;
                            item.type = "swf";
                            break;
                        case "link":
                            item.link = firstMedia.href;
                            item.type = "link";
                            break;    
                        default:
                            item.type = "app story";
                            break;    
                    }
                }else if(item.type == 247){

                    item.picture = _.find(item.attachment.media, function(item){
                        return item.type == "photo";
                    }).src;

                    item.type = "photo";
                }else{
                    item.type = types[item.type];    
                }
            },

            setSelectedMarket:function(market){
                this.selectedMarket = market;
            }


        });