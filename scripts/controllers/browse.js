	'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Task, Auth, Comment, Offer) {

	$scope.searchTask = '';
	$scope.tasks = Task.all;
	$scope.signedIn = Auth.signedIn;
	$scope.listMode = true;

	$scope.user = Auth.user;

	if($routeParams.taskId) {
		var task = Task.getTask($routeParams.taskId).$asObject();
		$scope.listMode = false;
		setSelectedTask(task);
	}

	function setSelectedTask(task) {
		$scope.selectedTask = task;

		if($scope.signedIn()) {

			// Check if the current user has already made an offer for selected task
			Offer.isOffered(task.$id).then(function(data) {
				$scope.alreadyOffered = data;
			});

			$scope.isTaskCreator = Task.isCreator;
			$scope.isOpen = Task.isOpen;
		}

		$scope.comments = Comment.comments(task.$id);
		$scope.offers = Offer.offers(task.$id);

		$scope.block = false;

		$scope.isOfferMaker = Offer.isMaker;
	}

	$scope.cancelTask = function(taskId) {
		Task.cancelTask(taskId).then(function() {
			toaster.pop('success', 'Tarefa cancelada com sucesso.');
		});
	}

	$scope.addComment = function() {
		var comment = {
			content: $scope.content,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};

		Comment.addComment($scope.selectedTask.$id, comment).then(function () {
			$scope.content = '';
		});
	}

	$scope.makeOffer = function() {
		var offer = {
			total: $scope.total,
			uid: $scope.user.uid,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};

		Offer.makeOffer($scope.selectedTask.$id, offer).then(function() {
			toaster.pop('success', 'Sua oferta foi realizada.');
			$scope.total = '';
			$scope.block = true;
			$scope.alreadyOffered = true;
		});
	}

	$scope.cancelOffer = function (offerId) {
		Offer.cancelOffer($scope.selectedTask.$id, offerId).then(function() {
			toaster.pop('success', 'Sua oferta foi cancelada.');

			$scope.alreadyOffered = false;
			$scope.block = false;
		})
	}

})