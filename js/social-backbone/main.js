(function($){
  
  var ItemStatus = {
    Published:0,
    UnPublished:1
  }
  
  
  
  var FlickrCollection = Backbone.Collection.extend({
    model:Backbone.Model.extend({}),
    
    user:"62767084@N06",
    apiKey:"4ccd2a64307c9f08f355cc88109f6232",
    loaded:false,
    
    fetch:function(){
      
      if(this.loaded){
        this.trigger("refresh");
        return;
      }
      $(window).openBar({message:"Retreiving Flickr Stream"});
      
      
      var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key="+this.apiKey+"&thumbnail_size=sq&link_to_size=l&user_id="+this.user+"&per_page=20&jsoncallback=?"
      
      var self = this;
      
      
      $.getJSON(url, function(response){
                self.loaded = true;
                var photos = response.photos.photo;
                $.each(photos, function(i, item){
                  item.type = "flickr";
                  item["dsp_title"] = item["dsp_tags"] = null,
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
    loaded:false,
    authToken:"332178.5532830.304dcae9620749e086bac69712af2051",
    
    fetch:function(){
      
      if(this.loaded){
        this.trigger("refresh");
        return;
      }
      $(window).openBar({message:"Retreiving Instagram Stream"});
      this.loaded = true;
      
      var url = 'https://api.instagram.com/v1/tags/' + this.tag + '/media/recent?count=20&access_token=' + this.authToken;
      var self = this;
      
      
      $(window).openBar({message:"Retreiving Flickr Stream"});
      this.loaded = true;
      
      $.ajax(
            {
              url:url,
              dataType:"jsonp",
              success:function(response){
                
                var photos = response.data;
                
                $.each(photos, function(i, item){
                  item.type = "instagram";
                  item["dsp_title"] = item["dsp_tags"] = null,
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
    loaded:false,
    
    fetch:function(){
      
      
      if(this.loaded){
        this.trigger("refresh");
        return;
      }
      $(window).openBar({message:"Retreiving MixCloud Stream"});
      
      
      var search = encodeURIComponent(this.filter);
      
      var url = "http://api.mixcloud.com/search/?q=" + search + "&type=cloudcast"
      var self = this;
      
      $.ajax({url:url, dataType:"jsonp", success:function(response){
        self.loaded = true;
        var mixes = response.data;
        
        $.each(mixes, function(i, item){
          item.type = "mixCloud";
          item["dsp_title"] = item["dsp_tags"] = null,
          item.status = ItemStatus.UnPublished;
        });
        
        self.refresh(mixes);
      }});
      
    }
    
  });
  
  
  var VideoCollection = Backbone.Collection.extend({
    
    model:Backbone.Model.extend({}),
    loaded:false,
    fetch:function(){
      
      
      
      if(this.loaded){
        this.trigger("refresh");
        return;
      }
      $(window).openBar({message:"Retreiving YouTube Stream"});
      this.loaded = true;
      
      
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
                  item["dsp_title"] = item["dsp_tags"] = null,
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
    
    authToken:"AAACEdEose0cBAJkRwgQZBWd88Ii9Au91svILwoZBtRPiC31gydaEuciI60yjMpbI1IZCbX5sVNb6enCqryMar84J4eZCjo5teAeKsxVO7wZDZD",
    loaded:false,
    fetch:function(){
      
      if(this.loaded){
        this.trigger("refresh");
        return;
      }
      $(window).openBar({message:"Retreiving Facebook Stream"});
      this.loaded = true;
      
      var url = "https://graph.facebook.com/Desperados/feed?access_token=" + this.authToken;
      var self = this;
      $.getJSON(url, function(response){
        
        var posts = response.data;
        
        $.each(posts, function(i, item){
          item.type = "facebook";
          item["dsp_title"] = item["dsp_tags"] = null,
          item.status = ItemStatus.UnPublished;
        });
        
        self.refresh(posts);
      });
      
    }
    
  });
  
  var TweetCollection = Backbone.Collection.extend({
    
    tweetOptions:{},
    loaded:false,
    model:Backbone.Model.extend({
      
      getDate:function(){
        var str = this.get("created_at")
        return new Date(str).toTimeString();
      }
    }),
    
    fetch:function(){
        
      if(this.loaded){
        this.trigger("refresh");
        return;
      }
      $(window).openBar({message:"Retreiving Twitter Stream"});
      
        
        var self = this;
          
        twitterlib.timeline('desperados_es', this.tweetOptions, function (tweets, options) {
          	
			self.loaded = true;
          
            $.each(tweets, function(i, item){
              item.type = "twitter";
              item["dsp_title"] = item["dsp_tags"] = null,
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
    editTemplate:"",
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
      "click a.add-item":"addItem",
      "click a.remove-item":"removeItem",
      'click .edit-box .save-edit':"saveEdit"
    },
    
    
    initialize:function(){
      _.bindAll(this, 'render');
    },
    
    saveEdit:function(e){
      
      var liItem = $(e.target).parent().parent().parent();
      
      var nTitle = liItem.find("input[name='title']").val();
      var nTags = liItem.find("input[name='tags']").val();
      
      var index = $(this.el).find("ul li").index(liItem);
      
      var item = this.model.at(index);
      item.set({"dsp_title":nTitle, "dsp_tags":nTags});
      
      $(window).openBar({message:"Changes saved"});
      
      this.render();
    },
    
    
    
    addItem:function(e){
      
      var liItem = $(e.target).parent().parent();
      
      var index = $(this.el).find("ul li").index(liItem);
      
      
      var item = this.model.at(index);
      item.set({"status":ItemStatus.Published});
      
      this.render();
      
      moderationModel.add(item);
      
      $(window).openBar({message:"Item added to main stream"});
      
    },
    
    
    removeItem:function(e){
      var liItem = $(e.target).parent().parent();
      
      var index = $(this.el).find("ul li").index(liItem);
      
      
      var item = this.model.at(index);
      item.set({"status":ItemStatus.UnPublished});
      
      var mItem = moderationModel.getByCid(item.cid);
      moderationModel.remove([mItem]);
      
      $(window).openBar({message:"Item removed from stream"});
      
      this.render();
      
    },
    
    render:function(){
      var self = this;
      this.el.innerHTML = _.template(this.listTemplate,
                                     {editTemplate:function(item){
                                        return _.template(self.editTemplate, item)
                                     }, data:this.model.toJSON(),
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
        var links = [{link:"Show Main Stream", route:"#mixed"},
                     {link:"Moderate Twitter", route:"#tweet"},
                     {link:"Moderate Facebook", route:"#facebook"},
                     {link:"Moderate Instagram (beer)", route:"#instagram"},
                     {link:"Moderate MixCloud (wild)", route:"#mixcloud"},
                     {link:"Moderate Flickr", route:"#flickr"},
                     {link:"Moderate YouTube", route:"#video"}];
        
        this.refresh(links);
    }
    
  });
  
  
  
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
  
  
  
  var FacebookController = {
    
    appId:"281703041866195",
    
    attachScript:function(){
      /// Load the SDK Asynchronously
      (function(d){
         var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
         js = d.createElement('script'); js.id = id; js.async = true;
         js.src = "//connect.facebook.net/en_US/all.js";
         d.getElementsByTagName('head')[0].appendChild(js);
       }(document));
      ///
    },
    
    initialized:false,
    
    checkToken:function(cb){
      
      var self = this;
      
      if(self.initialized){
        self.login(cb);
        return;
      }
      
      window.fbAsyncInit = function() {
        
        ///
        FB.init({
            appId      : self.appId, // App ID
            channelURL : '//localhost:8888/code/enzuguri-sandbox/js/social-backbone/channel.html', // Channel File
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            oauth      : true // enable OAuth 2.0
        });
        ///  
        
        self.initialized = true;
          
        self.login(cb); 
      };
      
      self.attachScript();
    },
    
    
    login:function(cb){
      ///
        FB.login(function(response) {
          if (response.authResponse) {
            wallModel.authToken = response.authResponse.accessToken;
            cb();
          } else {
            
          }
        }, {scope: ''});
        /// 
    }
  
    
  }
  
  
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
        feedView.editTemplate = $("#edit-template").html();
        feedView.setModel(flickrModel);
        flickrModel.fetch();
      },
      
      getInstagram:function(){
        feedView.editTemplate = $("#edit-template").html();
        feedView.setModel(instagramModel);
        instagramModel.fetch();
      },
      
      getTweets:function(){
        feedView.editTemplate = $("#edit-template").html();
        feedView.setModel(tweetModel);
        tweetModel.fetch();
      },
      
      getFacebook:function(){
        feedView.editTemplate = $("#edit-template").html();
        feedView.setModel(wallModel);
        FacebookController.checkToken(function(){
          wallModel.fetch();
        });
      },
      
      getVideos:function(){
        feedView.editTemplate = $("#edit-template").html();
        feedView.setModel(videoModel);
        videoModel.fetch();
      },
      
      getMixCloud:function(){
        feedView.editTemplate = $("#edit-template").html();  
        feedView.setModel(mixCloudModel);
        mixCloudModel.fetch();
      },
      
      getMixed:function(){
        feedView.editTemplate = $("#display-template").html();
        feedView.setModel(moderationModel);
        window.moderationModel.trigger("refresh");
        
      }
      
    
    });
    
    
    var router = new AppRouter();
  
    Backbone.history.start();
    
    $(window).openBar({message:"Welcome"});  
    
  
})(jQuery);