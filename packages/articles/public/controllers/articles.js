'use strict';

angular.module('mean').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles',
    function($scope, $stateParams, $location, Global, Articles) {
        $scope.global = Global;

        $scope.hasAuthorization = function(article){
            if ($scope.global.isAdmin || (article.user && (article.user._id === $scope.global.user._id))){
                return true;
            }
            return false;
        };

        $scope.create = function() {
            var article = new Articles({
                title: this.title,
                content: this.content
            });
            article.$save(function(response) {
                $location.path('articles/' + response._id);
            });

            this.title = '';
            this.content = '';
        };

        $scope.remove = function(article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove();
                $location.path('articles');
            }
        };

        $scope.update = function() {
            var article = $scope.article;
            if (!article.updated) {
                article.updated = [];
            }
            article.updated.push(new Date().getTime());

            article.$update(function() {
                $location.path('articles/' + article._id);
            });
        };

        $scope.find = function() {
            Articles.query(function(articles) {
                $scope.articles = articles;
            });
        };

        $scope.findOne = function() {
            Articles.get({
                articleId: $stateParams.articleId
            }, function(article) {
                $scope.article = article;
            });
        };
    }
]);
