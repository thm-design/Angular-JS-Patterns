//===================================== active-nav ===============================
  
  app.directive("activeNav",function($location) { 
      return {
            link: function postLink(scope, element, attrs) {
              scope.$on("$routeChangeSuccess", function (event, current, previous) {         
                  // this var grabs the tab-level off the attribute, or defaults to 1
                  var pathLevel = attrs.activeNav || 1,
                  // this var finds what the path is at the level specified
                      pathToCheck = $location.path().split('/')[pathLevel],
                  // this var finds grabs the same level of the href attribute
                      tabLink = attrs.href.split('#')[pathLevel];
                  // now compare the two:
                  if (pathToCheck === tabLink) {
                    element.addClass("active");
                  }
                  else {
                    element.removeClass("active");
                  }
              });
            }
          };
        });
        
        // add directive name to nav element must be <a> tag for href comparison
        <a href="#resume" active-nav="1">Resume</a>
        
//===================================== global error handler (http://blog.tomaka17.com/2012/12/random-tricks-when-using-angularjs/)  ===============================

  app.config(function($provide, $httpProvider, $compileProvider) {
        var elementsList = $();

        var showMessage = function(content, cl, time) {
            $('<div/>')
                .addClass('message')
                .addClass(cl)
                .hide()
                .fadeIn('fast')
                .delay(time)
                .fadeOut('fast', function() { $(this).remove(); })
                .appendTo(elementsList)
                .text(content);
        };
        
        $httpProvider.responseInterceptors.push(function($timeout, $q) {
            return function(promise) {
                return promise.then(function(successResponse) {
                    if (successResponse.config.method.toUpperCase() != 'GET')
                        showMessage('Success', 'successMessage', 5000);
                    return successResponse;

                }, function(errorResponse) {
                    switch (errorResponse.status) {
                        case 401:
                            showMessage('Wrong usename or password', 'errorMessage', 20000);
                            break;
                        case 403:
                            showMessage('You don\'t have the right to do this', 'errorMessage', 20000);
                            break;
                        case 500:
                            showMessage('Server internal error: ' + errorResponse.data, 'errorMessage', 20000);
                            break;
                        default:
                            showMessage('Error ' + errorResponse.status + ': ' + errorResponse.data, 'errorMessage', 20000);
                    }
                    return $q.reject(errorResponse);
                });
            };
        });

        $compileProvider.directive('appMessages', function() {
            var directiveDefinitionObject = {
                link: function(scope, element, attrs) { elementsList.push($(element)); }
            };
            return directiveDefinitionObject;
        });
  //===================================== Preloader element/overlay/gif/whatever=============================== 
  
  // https://gist.github.com/maikeldaloo/5140733
  // Just inject this into your app like so
  //var thmApp = angular.module('thmApp', ['ngRoute', 'ngSanitize', 'LoadingIndicator']);
  
var module = angular.module('LoadingIndicator', []);
 
module.config(['$httpProvider', function($httpProvider) {
    var interceptor = ['$q', 'LoadingIndicatorHandler', function($q, LoadingIndicatorHandler) {
        return function(promise) {
            LoadingIndicatorHandler.enable();
            
            return promise.then(
                function( response ) {
                    LoadingIndicatorHandler.disable();
                    
                    return response;
                },
                function( response ) {
                    LoadingIndicatorHandler.disable();
                    
                    // Reject the reponse so that angular isn't waiting for a response.
                    return $q.reject( response );
                }
            );
        };
    }];
    
    $httpProvider.responseInterceptors.push(interceptor);
}]);
 
/**
 * LoadingIndicatorHandler object to show a loading animation while we load the next page or wait
 * for a request to finish.
 */
module.factory('LoadingIndicatorHandler', ['$timeout', '$document', function($timeout)
{
    // The element we want to show/hide.
    var $element = $('#loading-indicator');
    
    return {
        // Counters to keep track of how many requests are sent and to know
        // when to hide the loading element.
        enable_count: 0,
        disable_count: 0,
        
        /**
         * Fade the blocker in to block the screen.
         *
         * @return {void}
         */
        enable: function() {
            this.enable_count++;
            
            if ( $element.length ) {
              $element.show(); 
            }
        },
        
        /**
         * Fade the blocker out to unblock the screen.
         *
         * @return {void}
         */
        disable: function() {
            this.disable_count++;
            
            if ( this.enable_count == this.disable_count ) {
                if ( $element.length ) {
                  $(window).scrollTop(0);
                  $timeout(function(){$element.fadeOut();},300); 
                  
                }
            } 
        }
    }
}]);
