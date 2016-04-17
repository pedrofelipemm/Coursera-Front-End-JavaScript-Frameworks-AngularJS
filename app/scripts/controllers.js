'use strict';
angular.module('confusionApp')
        
        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
            menuFactory.getDishes().query(function(response) {
            	$scope.dishes = response;
                $scope.showMenu = true;
            }, function(response) {
            	$scope.message = "Error: " + response.status + " " + response.statusText;
            });
            
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                } else if (setTab === 3) {
                    $scope.filtText = "mains";
                } else if (setTab === 4) {
                    $scope.filtText = "dessert";
                } else {
                    $scope.filtText = "";
                }
            };
            
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
            
            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
        }])
        
        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
        	$scope.sendFeedback = function() {
                if ($scope.feedback.agree && $scope.feedback.mychannel === "" && !$scope.feedback.mychannel) {
                    $scope.invalidChannelSelection = true;
                } else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.getFeedbacks().save($scope.feedback, function(data) {
                    	$scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
                    	$scope.feedback.mychannel="";
                    	$scope.feedbackForm.$setPristine();
                    }, function(data) {
                    	alert(JSON.stringify(data));
                    });
                }
            };
        }])
        
        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
        	$scope.showDish = false;
            $scope.message="Loading ...";
            
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)}).$promise.then(
            		function(response) {
            			$scope.dish = response;
            			$scope.showDish = true;
            		}, function(response) {
            			$scope.message = "Error: " + response.status + " " + response.statusText;
            		});
            
        }])
        
        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            function newComment(comment) {
                if(comment) {
                    return {author: comment.name, rating: parseInt(comment.rating), comment: comment.description, date: comment.date};    
                }
                
                return {name: '', rating: 5, description: '', date: null};
            }
            
            $scope.comment = newComment();
            
            $scope.hasError = function(field) {
                return field.$error.required && field.$dirty;
            };
            
            $scope.isFormValid = function(form) {
                return form.$dirty && form.$valid;
            };
            
            $scope.submitComment = function() {
                
                $scope.comment.date = new Date().toISOString();
                
                $scope.dish.comments.push(newComment($scope.comment));
                
                menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.comment = newComment();
            };
        }])
        
        .controller('IndexController', ['$scope', 'corporateFactory', 'menuFactory', function($scope, corporateFactory, menuFactory) {
        	$scope.showFeaturedDish = false;
        	$scope.showFeaturedPromotion = false;
        	$scope.showChef = false;
        	$scope.message = "Loading ...";
        	$scope.chefMessage = "Loading ...";
        	$scope.featuredPromotionMessage = "Loading ...";
        	
        	menuFactory.getDishes().get({id: 0}).$promise.then(function(response) {
        		$scope.featuredDish = response;
                $scope.showFeaturedDish = true;
            }, function(response) {
            	$scope.message = "Error: " + response.status + " " + response.statusText;
            });
        	
        	menuFactory.getPromotions().get({id: 4}).$promise.then(function(data) {
        		$scope.featuredPromotion = data;
        		$scope.showFeaturedPromotion = true;
        	}, function(data) {
        		$scope.featuredPromotionMessage = "Error: " + data.status + " " + data.statusText;
        	});
        	
        	corporateFactory.getLeaders().get({id: 3}).$promise.then(function(data) {
        		$scope.chef = data;
        		$scope.showChef = true;
        	}, function(data) {
        		$scope.chefMessage = "Error: " + data.status + " " + data.statusText;
        	});
        	
        }])
        
        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
        	$scope.leadersMessage = 'Loading ...';
        	$scope.showLeaders = false;
        	
        	
        	$scope.leaders = corporateFactory.getLeaders().query(function(data) {
        		$scope.leaders = data;
        		$scope.showLeaders = true;
        	}, function(data) {
        		$scope.leadersMessage = "Error: " + data.status + " " + data.statusText;
        	});
        	
        }]);