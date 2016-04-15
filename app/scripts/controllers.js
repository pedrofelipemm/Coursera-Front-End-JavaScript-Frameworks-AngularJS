'use strict';
angular.module('confusionApp')
        
        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            
            $scope.dishes= [];
            
            menuFactory.getDishes().then(function(response) {
            	$scope.dishes = response.data;
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
        
        .controller('FeedbackController', ['$scope', function($scope) {
            $scope.sendFeedback = function() {
                console.log($scope.feedback);
                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")&& !$scope.feedback.mychannel) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                } else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])
        
        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
        	$scope.dish = {};
            menuFactory.getDish(parseInt($stateParams.id,10)).then(function(response) {
            	$scope.dish = response.data;
            	$scope.showDish=true;
            });
        }])
        
        .controller('DishCommentController', ['$scope', function($scope) {
            
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
                
                $scope.commentForm.$setPristine();
                
                $scope.comment = newComment();
            };
        }])
        
        .controller('IndexController', ['$scope', 'corporateFactory', 'menuFactory', function($scope, corporateFactory, menuFactory) {
        	$scope.featuredDish = {};

            menuFactory.getDish(0).then(function(response) {
            	$scope.featuredDish = response.data;
                $scope.showFeaturedDish = true;
            });
        	
        	$scope.featuredPromotion = menuFactory.getPromotion(0);
        	$scope.chef = corporateFactory.getLeader(3);
        	
        }])
        
        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
        	
        	$scope.leaders = corporateFactory.getLeaders();
        	
        }]);