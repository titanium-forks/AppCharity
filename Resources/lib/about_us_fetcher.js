AboutUsFetcher = function(current_page_number){
  current_page_number = current_page_number || 1;
  
  // What I want to do is be able to pass in a current_page_number
  // TODO: I think this should be cached, somehow.. -eric
  var fetchAllSubpageData = function(cb){
    Cloud.Objects.query({
        classname: 'AboutUsPage',
        page: 1,
        per_page: 10
    }, function (e) {
        if (e.success) {
          var pages = e.AboutUsPage;
          cb(pages);
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
  };
  
  // It would be lovely to cache the data in a variable and then pull that data from the cached variable. But I am unsure how to do that.. -eric
  
  var fetchCurrentTitle = function(cb){
    
  };
  
  var fetchCurrentPhoto = function(cb){
    
  };
  
  var fetchCurrentContent = function(cb){
    
  };
  
  
  return {
          current_page_number: current_page_number, 
          // @param cb {function} the callback function after the title is received.
          fetchCurrentTitle: fetchCurrentContent, 
          // @param cb {function} the callback function after the image_url is received.
          fetchCurrentPhoto: fetchCurrentPhoto, 
          // @param cb {function} the callback function after the content is received.
          fetchCurrentContent: fetchCurrentContent, 
          fetchAllSubpageData: fetchAllSubpageData
          };
};