/*jshint unused:false*/

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('#showForest').click(getForest);
    $('#tradingPost').on('click', '#trade', trade);
    $('#forest').on('click', '.tree.alive>#grow', grow);
    $('#forest').on('click', '.tree.alive.adult.unchopped>#chop', chop);
  }

  function chop(){
    var tree = $(this).parent();
    var treeID = tree.data('id');//this is in the tree.jade file
    $.ajax({
      url: `/tree/${treeID}/chop`,
      type: 'PUT',
      success: response =>{
         tree.replaceWith(response.html);
         $('#userStats').text(`wood: ${response.userData.wood} cash: ${response.userData.cash}`);
      }
    });
  }

  function grow(){
    var tree = $(this).parent();
    var treeID = tree.data('id');
    $.ajax({
      url: `/tree/${treeID}/grow`,
      type: 'PUT',
      dataType: 'html',
      success: treeObj =>{
        tree.replaceWith(treeObj);
      }
    });
  }

  function getForest(){
    var userId = $('#username').data('userid');
    $.ajax({
      url: `/forest/${userId}`,
      type: 'GET',
      dataType: 'html',
      success: trees =>{
        $('#forest').empty().append(trees);
      }
    });
  }

  function seed(){
    var userId = $('#username').data('userid');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userid: userId},
      success: tree =>{
        $('#forest').append(tree);
      }
    });
  }

  function login(event){
    var loginData = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: loginData,
      success: response =>{
        $('#login').prev().val('');
        $('#username').attr('data-userid', response.user._id);
        $('#username').text(response.user.username);
        $('#userStats').text(`wood: ${response.user.wood} cash: ${response.user.cash}`);
        $('#tradingPost').append(response.html);
      }
    });
    event.preventDefault();
  }

  function trade(event){
    var tradeAmount = $(this).closest('form').serialize().split('=');
    var userID = $(this).closest('div').prev().prev().data('userid');
    var tradeAndUser = {tradeAmount: tradeAmount[1], userID: userID};

    $.ajax({
      url: '/trade',
      type: 'PUT',
      data: tradeAndUser,
      success: response =>{
        $('#trade').prev().val('');
        $('#userStats').text(`wood: ${response.wood} cash: ${response.cash}`);
        //console.log(response.body);
      }
    });
    event.preventDefault();
  }

})();
