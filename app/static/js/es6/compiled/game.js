(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#showForest').click(getForest);
    $('#tradingPost').on('click', '#trade', trade);
    $('#forest').on('click', '.tree.alive>#grow', grow);
    $('#forest').on('click', '.tree.alive.adult.unchopped>#chop', chop);
  }
  function chop() {
    var tree = $(this).parent();
    var treeID = tree.data('id');
    $.ajax({
      url: ("/tree/" + treeID + "/chop"),
      type: 'PUT',
      success: (function(response) {
        tree.replaceWith(response.html);
        $('#userStats').text(("wood: " + response.userData.wood + " cash: " + response.userData.cash));
      })
    });
  }
  function grow() {
    var tree = $(this).parent();
    var treeID = tree.data('id');
    $.ajax({
      url: ("/tree/" + treeID + "/grow"),
      type: 'PUT',
      dataType: 'html',
      success: (function(treeObj) {
        tree.replaceWith(treeObj);
      })
    });
  }
  function getForest() {
    var userId = $('#username').data('userid');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      dataType: 'html',
      success: (function(trees) {
        $('#forest').empty().append(trees);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('userid');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userid: userId},
      success: (function(tree) {
        $('#forest').append(tree);
      })
    });
  }
  function login(event) {
    var loginData = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: loginData,
      success: (function(response) {
        console.log('look HERE stupid');
        console.log(response);
        $('#login').prev().val('');
        $('#username').attr('data-userid', response.user._id);
        $('#username').text(response.user.username);
        $('#userStats').text(("wood: " + response.user.wood + " cash: " + response.user.cash));
        $('#tradingPost').append(response.html);
      })
    });
    event.preventDefault();
  }
  function trade(event) {
    var tradeAmount = $(this).closest('form').serialize();
    $.ajax({
      url: '/trade',
      type: 'PUT',
      data: tradeAmount,
      success: (function(response) {})
    });
    event.preventDefault();
  }
})();

//# sourceMappingURL=game.map
