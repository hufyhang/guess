/* global $ch */
'use strict';

var DICT = JSON.parse($ch.readFile('./dict.json'));
var CATEGORIES = Object.keys(DICT);
var TARGET_TEMP = $ch.readFile('./targetTemplate.html');
var LIST_TEMP = $ch.readFile('./listTemplate.html');

var buffer = [];

$ch.use(['./chop-bundle'], function () {
  $ch.source("timer", "--");
  $ch.source("good", 0);
  $ch.source("total", 0);
  $ch.source('state', "ready");

  $ch.scope('appScope', function ($scope) {
    $ch.source('container', $scope.container);
    loadList();
  });
});

function loadList() {
  buffer = [];
  clearInterval($ch.source('interval'));
  $ch.source("timer", "--");
  $ch.source("good", 0);
  $ch.source("total", 0);
  $ch.source('state', "ready");

  var container = $ch.source('container');
  container.html(LIST_TEMP);
  $ch.scope('listScope', function ($scope) {
    var list = CATEGORIES.map(function (item, index) {
      return {index: index, name: item};
    });
    $scope.list.inline(list);
  });
}

function loadWord(index) {
  var container = $ch.source('container');
  container.html(TARGET_TEMP);
  var dict = DICT[CATEGORIES[index]];
  $ch.scope('targetScope', function ($scope, $event) {
    addSwipe($scope, dict, index);

    $event.listen('word', function () {
      initWord($scope, dict);
    });

    initWord($scope, dict);
  });

  if ($ch.source('state') === 'ready') {
    $ch.source('timer', 90);
    var interval = setInterval(function () {
      $ch.source('interval', interval);
      var tick = $ch.source('timer');
      tick -= 1;
      if (tick <= 0) {
        tick = 0;
        clearInterval(interval);
        $ch.source('timer', tick);
        $ch.source('state', 'ready');
        alert('Time\'s up!\nScore: ' + $ch.source('good') + '/' + $ch.source('total'));
      } else {
        $ch.source('timer', tick);
      }
    }, 1000);
    $ch.source('state', 'going');
  } else {
    var total = $ch.source('total') + 1;
    $ch.source('total', total);
  }
}

function addSwipe($scope, dict, index) {
  $scope.touch = {start: 0, end: 0};

  $scope.swipe.on('touchmove', function (event) {
    event.preventDefault();
  });

  $scope.swipe.on('touchstart', function (event) {
    var touch = event.touches[0];
    $scope.touch = {start: 0, end: 0};
    $scope.touch.start = touch.pageX;
  });

  $scope.swipe.on('touchend', function () {
    $scope.swipe.css('left', '0')
    .css('right', '0');
  });

  $scope.swipe.on('touchmove', function (event) {
    var touch = event.touches[0];
    $scope.touch.end = touch.pageX;
    var x = $scope.touch;

    var offsetL = x.end - x.start;
    var offsetR = x.start - x.end;
    $scope.swipe.css('left', offsetL + 'px')
    .css('right', offsetR + 'px');

    if (offsetL > 100) {
      $scope.touch.start = $scope.touch.end;
      $scope.swipe.css('left', '0')
      .css('right', '0');
      loadWord(index);
      // initWord($scope, dict);
    }
    else if (offsetR > 100) {
      $scope.touch.start = $scope.touch.end;
      $scope.swipe.css('left', '0')
      .css('right', '0');
      goodWord(index);
      // initWord($scope, dict);
    }
  });
}

function goodWord(index) {
  var good = $ch.source('good') + 1;
  $ch.source('good', good);
  loadWord(index);
}

function initWord($scope, dict) {
  $scope.target.set(getWord(dict));
}

function getWord(dict) {
  if (buffer.length === dict.length) {
    buffer = [];
  }

  var index = $ch.utils.random(0, dict.length);
  while (buffer.indexOf(index) !== -1) {
    index = $ch.utils.random(0, dict.length);
  }
  buffer.push(index);
  return dict[index];
}
