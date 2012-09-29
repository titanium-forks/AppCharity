Push = (function(debug){
  if(isMobileweb) { return {unsubscribe: id, subscribe: id}; }
  var Cloud = require('ti.cloud');
  Cloud.debug = true;  // optional; if you add this line, set it to false for production
  
  if(isAndroid) {
    var CloudPush = require('ti.cloudpush');
    CloudPush.enabled = true;
  }
  
  var logInAsGenericUserToAvoidErrorHack = function(cb) {
        Cloud.Users.login({login: 'drboolean', password: '123456'}, function (e) {
          e.success ? cb() : log('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
        });
      },
      
      iphoneRegister = function(pushCallback, registeredCallback) {
        log("iphoneRegister");
        logInAsGenericUserToAvoidErrorHack(function() {
          Ti.Network.registerForPushNotifications({
            types: [
                Ti.Network.NOTIFICATION_TYPE_BADGE,
                Ti.Network.NOTIFICATION_TYPE_ALERT,
                Ti.Network.NOTIFICATION_TYPE_SOUND
            ], success:registeredCallback,
            error: function(e){ Ti.API.info("=========PUSH ERROR\n\n\n"); Ti.API.info(e); },
            callback: pushCallback ? pushCallback : id
          }); 
        });
      },
      
      androidRegister = function(pushCallback, registeredCallback) {
        logInAsGenericUserToAvoidErrorHack(function() {
          if(pushCallback) { CloudPush.addEventListener('callback', pushCallback); }
          CloudPush.retrieveDeviceToken({
            success: registeredCallback,
            error: function(e) { log('There was an error '+e.error); }
          });
        });
      },

      platformRegister = isIPhone ? iphoneRegister : androidRegister,
      
      unsubscribe = function(cb) {
        var registeredCallback = function(e) {
              log("registeredCallback");
              log(e);
              Ti.App.Properties.setBool('push_register', false);
              Cloud.PushNotifications.unsubscribe(
                {device_token: e.deviceToken},
                function(e) { if(cb) { cb(); } }
              );
            };
        platformRegister(id, registeredCallback);
      }, 

      subscribe = function(channel, pushCallback) {
        var registeredCallback = function(e) {
          log("registeredCallback!!!");
          log(e);
              unsubscribe(function() {
                Ti.App.Properties.setBool('push_register', true);
                Cloud.PushNotifications.subscribe(
                  {channel: channel, 
                   device_token: e.deviceToken, 
                   type: (isIPhone ? 'ios' : 'android')}, 
                   function (e) { 
                     log("callback after subscribe");
                     if(!e.success) { log('Error:\\n' + ((e.error && e.message) || JSON.stringify(e))); }
                  }
                );
              });
            };
        platformRegister(pushCallback, registeredCallback);
      };

    return {subscribe: subscribe, unsubscribe: unsubscribe};
})();

