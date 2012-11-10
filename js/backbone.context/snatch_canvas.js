/* 
Dependencies:
lifelike.utils.js
jquery-1.7.1.min.js
*/

//Declare namespace
se.lifelike.namespace('com.heineken.desperados.snatch');

//Runtime
com.heineken.desperados.snatch.Runtime = function () {

    //---------------------------
    // *** Private ***
    //---------------------------
    var _swfName = "flash_content";
    //	var _canvasName = "snatch_stage";
    //var _appNamespace = "snatch_stage";
    //var _appId = '297331067005190';
    var _this = this;
    var _locale;
    var _feedDialogDisplay;
    var _approvedUsers = ['1464805209', '100003618454519', '100003674085215', '697054466', '100002828398691', '100003516731584', '591451250', '675765543', '629857869', '821843959', '563698142', '750890128', '100003613816497'];

    //---------------------------------
    // SWF Embedd
    //---------------------------------

    //Vars
    function embedSWF() {
        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        var _dev = "";
        var _market = se.lifelike.getQueryVariable("market") == null ? "en" : se.lifelike.getQueryVariable("market");
        var _language = se.lifelike.getQueryVariable("lang") == null ? "en" : se.lifelike.getQueryVariable("lang");
        var _uid = se.lifelike.getQueryVariable("teaserid") == null ? "" : se.lifelike.getQueryVariable("teaserid");
        var _baseurl = "/Flash/";
        //var _env = se.lifelike.getQueryVariable("env") == null ? "dev" : se.lifelike.getQueryVariable("env");
        _locale = _market + "_" + _language;

        var flashvars = {};
        flashvars.debug = _dev;
        flashvars.locale = _locale;
        flashvars.baseURL = _baseurl;
        flashvars.uid = _uid;
        flashvars.appid = _appId;
        flashvars.env = _env;
        flashvars.originURL = _originURL;
        flashvars.platform = _platform;
        flashvars.cdnURL = _cdnUrl;
        flashvars.campaignURL = _campaignURL;

        var params = {};
        params.menu = "false";
        if (is_chrome) {
            params.wmode = "transparent";
        } else {
            params.wmode = "window";
        }
        params.allowfullscreen = "true";
        params.allowScriptAccess = "always";

        var attributes = {};
        attributes.id = "flash_content";
        attributes.name = "flash_content";

        //if(_locale != 'uk_en'){
        swfobject.embedSWF(_baseurl + "runtime.swf", "flash_content", "970", "845", "10.0.2", _baseurl + "expressInstall.swf", flashvars, params, attributes);
        //}
    };

    //---------------------------------------------------------------//



    //---------------------------------
    // Flash callback
    //---------------------------------
    function flashCallBack(func, value) {
        document[swfName][func](value);
    }


    //---------------------------
    // Build
    //---------------------------
    function build() {
        if (snatchFBDebug != true) {
            embedSWF();
        }
        //embedSWF();
    };

    function initFacebook() {

        //Check so not accessed outside facebook
        if (window == top) {
            goHome();
        }

        FB.init({
            appId: _appId,
            status: true,
            cookie: true,
            authResponse: true
        });

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                //	console.log('logged in and authenticated');
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;

                if(window.location.indexOf("appInstall") > -1){
                    var el = document.createElement("img");
                    el.setAttribute("height", "1");
                    el.setAttribute("width", "1");
                    el.setAttribute("alt", "Mediaplex_tag");
                    el.setAttribute("src", "//altfarm.mediaplex.com/ad/bk/19547-138995-3840-0?App_install=1&amp;mpuid=" + Math.floor(Math.random() * 1000));
                    document.getElementsByTagName("body")[0].appendChild(el);
                }


                if (snatchFBDebug == true) {
                    applyUserRestriction(uid);
                } else {
                    $('#no_flash_content').show();
                    $('#no_flash_internal').show();
                }
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
                goAuthenticate();
            } else {
                // the user isn't logged in to Facebook.
                goHome();
            }
        });
    };

    function goAuthenticate() {
        var teaserQuery = se.lifelike.getQueryVariable("teaserid") == null ? "" : "?teaserid=" + se.lifelike.getQueryVariable("teaserid");
        var oauth_url = 'https://www.facebook.com/dialog/oauth/';
        oauth_url += '?client_id=' + _appId;
        oauth_url += '&redirect_uri=' + encodeURIComponent('https://apps.facebook.com/' + _appNamespace + '/' + teaserQuery);
        oauth_url += '&scope=publish_stream,user_birthday'

        window.top.location = oauth_url;
    };


    function goHome() {
        var teaserQuery = se.lifelike.getQueryVariable("teaserid") == null ? "" : "?teaserid=" + se.lifelike.getQueryVariable("teaserid");
        top.location = 'https://apps.facebook.com/' + _appNamespace + '/' + teaserQuery;
    }

    function applyUserRestriction(uid) {
        if (checkUserAccess(uid) == true) {
            //	console.log('Approved user');	
            if (swfobject.hasFlashPlayerVersion("10") || swfobject.hasFlashPlayerVersion("11") || swfobject.hasFlashPlayerVersion("12")) {
                embedSWF();
            } else {
                $('#no_flash_content').show();
                $('#no_flash_internal').show();
            }
        } else {
            //	console.log('Not approved user');
        }
    }

    function checkUserAccess($uid) {
        for (var i = 0; i < _approvedUsers.length; i++) {
            if (_approvedUsers[i] == $uid) {
                return true;
            }
        }
        return false;
    }

    function getInternetExplorerVersion() {
        // Returns the version of Internet Explorer or a -1
        // (indicating the use of another browser).
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    }

    //---------------------------
    // *** Public  ***
    //---------------------------
    this.initialize = function () {
        $('#no_flash_content').hide();
        $('#no_flash_internal').hide();
        initFacebook();
        //alert("initilialize");

        //FB._https = true;
        //if(_locale == 'uk_en'){
        //	$('#flash_content').hide();
        //	$('#coming_soon').show();
        //}
        /*		
        navigator.appCodeName
        navigator.appName
        navigator.appVersion
        navigator.cookieEnabled
        navigator.platform
        navigator.userAgent
        */
        var ieVersion = getInternetExplorerVersion();
        if (ieVersion >= 8.0) {
            _feedDialogDisplay = 'popup';
        } else {
            _feedDialogDisplay = 'iframe';
        }

    };

    this.openFeedDialog = function (_name, _link, _pic, _caption, _description, _source) {
        FB.ui({
            method: 'feed',
            display: _feedDialogDisplay,
            name: _name,
            link: _link,
            picture: _pic,
            caption: _caption,
            description: _description,
            source: _source
        },
				function (response) {
				    if (response && response.post_id) {
				        //alert('Post was published.');
				        _this.postCallBack(true);
				    } else {
				        //alert('Post was not published.');
				        _this.postCallBack(false);
				    }
				}
			);
        return false;
    }

    this.postCallBack = function (result) {
        //Add swf callback
    }

    //Constructor
    build();
    se.lifelike.addLoadEvent(_this.initialize)

};
//---------------------------
// Onload
//---------------------------
//---------------------------
// Onload
//---------------------------
//(function() {
	var runtime = new com.heineken.desperados.snatch.Runtime();

//}());