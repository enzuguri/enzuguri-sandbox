(function($){
  
  var ItemStatus = {
    Published:0,
    UnPublished:1
  }
  
  
  
  var FlickrCollection = Backbone.Collection.extend({
    model:Backbone.Model.extend({}),
    
    user:"62767084@N06",
    apiKey:"4ccd2a64307c9f08f355cc88109f6232",
    
    fetch:function(){
      
      var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key="+this.apiKey+"&thumbnail_size=sq&link_to_size=l&user_id="+this.user+"&per_page=20&jsoncallback=?"
      
      var self = this;
      
      $.getJSON(url, function(response){
                
                var photos = response.photos.photo;
                $.each(photos, function(i, item){
                  item.type = "flickr";
                  item.status = ItemStatus.UnPublished;
                });
                self.refresh(photos);
              }
      );
      
    }
    
  });
  
  
  var InstagramCollection = Backbone.Collection.extend({
    
    model:Backbone.Model.extend({}),
    
    tag:"beer",
    
    authToken:"332178.5532830.304dcae9620749e086bac69712af2051",
    
    fetch:function(){
      
      var url = 'https://api.instagram.com/v1/tags/' + this.tag + '/media/recent?count=20&access_token=' + this.authToken;
      var self = this;
      
      $.ajax(
            {
              url:url,
              dataType:"jsonp",
              success:function(response){
                
                var photos = response.data;
                
                $.each(photos, function(i, item){
                  item.type = "instagram";
                  item.status = ItemStatus.UnPublished;
                });
                self.refresh(photos);
              }
            }
      );
    }
    
  });
  
  
  var MixCloudCollection = Backbone.Collection.extend({
    
    model:Backbone.Model.extend({}),
    
    filter:"wild",
    
    fetch:function(){
      
      var search = encodeURIComponent(this.filter);
      
      var url = "http://api.mixcloud.com/search/?q=" + search + "&type=cloudcast"
      var self = this;
      
      $.ajax({url:url, dataType:"jsonp", success:function(response){
        
        var mixes = response.data;
        
        $.each(mixes, function(i, item){
          item.type = "mixCloud";
          item.status = ItemStatus.UnPublished;
        });
        
        self.refresh(mixes);
      }});
      
    }
    
  });
  
  
  var VideoCollection = Backbone.Collection.extend({
    
    model:Backbone.Model.extend({}),
    
    fetch:function(){
      var self = this;
      $.jTube({
              request: 'user',
              requestValue: 'desperados',
              requestOption: 'uploads',
              limit: 20,
              page: 1,
              success: function(videos) {
                
                
                $.each(videos, function(i, item){
                  item.type = "youtube";
                  item.status = ItemStatus.UnPublished;
                });
                
                self.refresh(videos);      
              },
              error: function(error) {
                //$('#example').html(error);
              }
      });
      
    }
  });
  
  
  var WallCollection = Backbone.Collection.extend({
      
    model:Backbone.Model.extend({
      
      getDate:function(){
        var str = this.get("created_time")
        return new Date(str).toTimeString();
      }  
      
    }),
    
    fetch:function(){
      var authToken = "AAACEdEose0cBAJkRwgQZBWd88Ii9Au91svILwoZBtRPiC31gydaEuciI60yjMpbI1IZCbX5sVNb6enCqryMar84J4eZCjo5teAeKsxVO7wZDZD";
      var url = "https://graph.facebook.com/Desperados/feed?access_token=" + authToken;
      var self = this;
      $.getJSON(url, function(response){
        
        var posts = response.data;
        
        $.each(posts, function(i, item){
          item.type = "facebook";
          item.status = ItemStatus.UnPublished;
        });
        
        self.refresh(posts);
      });
      
    }
    
  });
  
  var TweetCollection = Backbone.Collection.extend({
    
    tweetOptions:{},
    
    model:Backbone.Model.extend({
      
      getDate:function(){
        var str = this.get("created_at")
        return new Date(str).toTimeString();
      }
    }),
    
    fetch:function(){
        
        var self = this;
          
        twitterlib.timeline('desperados_es', this.tweetOptions, function (tweets, options) {
          
          
            $.each(tweets, function(i, item){
              item.type = "twitter";
              item.status = ItemStatus.UnPublished;
            });
          
            self.refresh(tweets);
        }); 
    },
    
    setSearch:function(term){  
      this.tweetOptions = {filter:term}
      this.fetch();
    }
    
  });
  
  
  var ModerationCollection = Backbone.Collection.extend({
    
    model:Backbone.Model.extend({})
    
  });
  
  
  
  
  var tweetModel = new TweetCollection();
  var wallModel = new WallCollection();
  var videoModel = new VideoCollection();
  var instagramModel = new InstagramCollection();
  var mixCloudModel = new MixCloudCollection();
  var flickrModel = new FlickrCollection();
  
  var moderationModel = new ModerationCollection();
  
  window.moderationModel = moderationModel;
  
  var mainFeed = $("#main-feed")[0];
  
  /*
   
   Link bar
   
  */
  
  
  var FeedView = Backbone.View.extend({
    
    listTemplate:$("#feed-template").html(),
    model:null,
    itemTemplates:{
      "mixCloud":$("#mixCloud-item-template").html(),
      "youtube":$("#youtube-item-template").html(),
      "facebook":$("#fb-item-template").html(),
      "twitter":$("#tweet-item-template").html(),
      "instagram":$("#instgram-item-template").html(),
      "flickr":$("#flickr-item-template").html()
    },
    el:mainFeed,
    
    events:{
      "click a.add-item":"addItem"
    },
    
    
    initialize:function(){
      _.bindAll(this, 'render');
    },
    
    
    addItem:function(e){
      
      var liItem = $(e.target).parent().parent();
      
      var index = $(this.el).find("ul li").index(liItem);
      
      
      var item = this.model.at(index);
      item.set({"status":ItemStatus.Published});
      
      this.render();
      
      moderationModel.add(item);
    },
    
    render:function(){
      var self = this;
      this.el.innerHTML = _.template(this.listTemplate,
                                     {data:this.model.toJSON(),
                                      templateSub:function(item){
                                        return self.templateItem(item);
                                      }
                                    });
    },
    
    templateItem:function(data){
      
      var itemTemplate = this.itemTemplates[data.type];
      var str = _.template(itemTemplate, {data:data});
      return str;
    },
    
    
    setModel:function(value){
      
      if(this.model != null){
        this.model.unbind("refresh", this.render);
      }
      
      this.model = value;
      this.model.bind("refresh", this.render, this);
    }
    
    
  });
  
  var feedView = new FeedView();
  
  
  var LinksCollection = Backbone.Collection.extend({
    
    model: Backbone.Model.extend({ }),
    
    fetch:function(opts){
        var links = [{link:"Get Moderated", route:"#mixed"},
                     {link:"Get Tweets", route:"#tweet"},
                     {link:"Get Facebook", route:"#facebook"},
                     {link:"Get Instagram (beer)", route:"#instagram"},
                     {link:"Get MixCloud (wild)", route:"#mixcloud"},
                     {link:"Get Flickr", route:"#flickr"},
                     {link:"Get YouTube", route:"#video"}];
        
        this.refresh(links);
    }
    
  });
  
  window.tweetModel = tweetModel;
  
  var linkModel = new LinksCollection();
  
  
  var LinkBar = Backbone.View.extend({
    
    template:$("#link-bar-template").html(),
    model:linkModel,
    
    el: $('#link-bar')[0],
    
    events:{
        'click .link-item' : 'navigateBar',
        'click #search-button': 'doSearch'
    },
    
    initialize: function(){
      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       this.model.bind("refresh", this.render, this);
       
       this.model.fetch();
    },
    
    
    doSearch:function(){
      
      var text = $(this.el).find("#search-input").val();
      
      tweetModel.setSearch(text);
      
    },
    
    render: function(){
        this.el.innerHTML = _.template(this.template, {data:this.model.toJSON()});
    },
    
    navigateBar:function(e){
        
        var item = $(e.target);
        
    }
    
  });
  
  var bar = new LinkBar();
  
  
  
  var AppRouter = Backbone.Controller.extend({
    
      routes:{
        
        "tweet":"getTweets",
        "facebook":"getFacebook",
        "video":"getVideos",
        "instagram":"getInstagram",
        "mixcloud":"getMixCloud",
        "flickr":"getFlickr",
        "mixed":"getMixed"
        
      },
      
      getFlickr:function(){
        feedView.setModel(flickrModel);
        flickrModel.fetch();
      },
      
      getInstagram:function(){
        feedView.setModel(instagramModel);
        instagramModel.fetch();
      },
      
      getTweets:function(){
        feedView.setModel(tweetModel);
        tweetModel.fetch();
      },
      
      getFacebook:function(){
        feedView.setModel(wallModel);
        wallModel.fetch();
      },
      
      getVideos:function(){
        feedView.setModel(videoModel);
        videoModel.fetch();
      },
      
      getMixCloud:function(){
        
        feedView.setModel(mixCloudModel);
        mixCloudModel.fetch();
      },
      
      getMixed:function(){
        feedView.setModel(moderationModel);
        window.moderationModel.trigger("refresh");
        
      }
      
    
    });
  
  
  var router = new AppRouter();
  
  Backbone.history.start();
  
  
    
  
})(jQuery);