/*global angular  */

/* we 'inject' the ngRoute module into our app. This makes the routing functionality to be available to our app. */
var myApp = angular.module('myApp', ['ngRoute','google.places'])	//NB: ngRoute module for routing and deeplinking services and directives

/* the config function takes an array. */
myApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/search', {
		  templateUrl: 'templates/search.html',
      controller: 'searchController'
		})
    .when('/detail/:id', {
      templateUrl: 'templates/detail.html',
      controller: 'detailController'
    })
    .when('/favourites', {
		  templateUrl: 'templates/favourites.html',
      controller: 'favouritesController'
		})
    .when('/places', {
		  templateUrl: 'templates/places.html',
      controller: 'placesController'
		})
		.otherwise({
		  redirectTo: 'search'
		})
	}])


myApp.controller('searchController', function($scope, $http) {
  $scope.message = 'This is the search screen'

  $scope.reqPost = function(req, res){
  	var url = 'https://cde305-permacultureprogrammer.c9users.io:8081/recipes'
  	console.log('POST ' +url)
  	$http.post(url).success(function(response) {
      console.log(response)
  	})
  }

  $scope.search = function($event) {
    console.log('search()')
    if ($event.which == 13 || $event.which == 112) { // enter key presses
      var searchTerm = $scope.searchTerm
      var url = ''
      if ($event.which == 13)
      	url = 'https://www.googleapis.com/books/v1/volumes?maxResults=40&fields=items(id,volumeInfo(title))&q='+searchTerm
      else if($event.which == 112)
      	url = 'https://cde305-permacultureprogrammer.c9users.io:8081/search?q='+searchTerm

      console.log(url)
      $http.get(url).success(function(response) {
        console.log(response)
        if (response.data)
        	$scope.books = response.data
        else if (response.items)
        	$scope.books = response.items
        //$scope.searchTerm = ''
      })
    }
  }
})

myApp.controller('detailController', function($scope, $routeParams, $http) {
  $scope.message = 'This is the detail screen'
  $scope.id = $routeParams.id

  var url = 'https://www.googleapis.com/books/v1/volumes/' + $scope.id
  $http.get(url).success(function(rspBook) {
    console.log("found book" + $scope.id)
    $scope.book = {}
    $scope.book.title = rspBook.volumeInfo.title
    $scope.book.summary = rspBook.volumeInfo.description
    $scope.book.stars = rspBook.volumeInfo.averageRating
    $scope.book.cover = rspBook.volumeInfo.imageLinks.large
  })

  $scope.addToFavourites = function(id, title) {
    console.log('adding: '+id+' to favourites.')
    localStorage.setItem(id, title)
  }
})

myApp.controller('favouritesController', function($scope) {
  console.log('fav controller')
  $scope.message = 'This is the favourites screen'
  var init = function() {
    console.log('getting books')
    var items = new Array();		//alt: = []; for blank array obj
    //for (var key in localStorage) {	//for-in will include key, getItem, setItem, removeItem, clear & length
    for(var i = 0; i < localStorage.length; i++) {
    	var key = localStorage.key(i);	//native methods are ignored
    	var obj = {};
    	//items.push( {key: localStorage.getItem(key)} )  //TRY1 {key: ...} forced to hardcode key
    	//items.push(obj[key] = localStorage.getItem(key))	//TRY2 {dym-key: ...} hard to code in <ng-repeat>
    	items.push({id: key, title:localStorage.getItem(key)})  //TRY3 OK
      //alt: items[key] = localStorage[key]
    }
    console.log(items)
    $scope.books = items
  }
  init()

  $scope.delete = function(id) {
  	localStorage.clear()
    console.log('deleting id '+id)
  }
  $scope.deleteAll = function(){ localStorage.clear(); init();}
})



myApp.controller('placesController', function($scope) {
	console.log('fav controller')
	$scope.message = 'example'
})



