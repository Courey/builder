'use strict';
var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var _ = require('lodash');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper.js');


exports.index = (req, res)=>{
  res.render('game/index', {title: 'Game'});
};

exports.trade = (req, res)=>{

  console.log(req.body.wood);
};

exports.grow = (req, res)=>{
  var treeID = Mongo.ObjectID(req.params.treeID);

  trees.findOne({_id: treeID}, (error, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0,100) !== 69;
    trees.save(tree, (error, count)=>{
      res.render('game/tree', {tree: tree, treeHelper: treeHelper}, (error, html)=>{
        res.send(html);
      });
    });
  });
};

exports.chop = (req, res)=>{
  var treeID = Mongo.ObjectID(req.params.treeID);

  trees.findOne({_id: treeID}, (error, tree)=>{
    var wood = tree.height/2;
    var userID = tree.userid;
    tree.isChopped = true;
    users.findOne({_id: userID},(error, userData)=>{
      userData.wood += wood;
      users.save(userData, (error, count)=>{
        res.render('game/tree', {tree: tree, user: userData, treeHelper: treeHelper}, (error, html)=>{
          var both ={html: html, userData: userData};
          res.send(both);
        });
      });
    });
  });
};

exports.forest = (req, res)=>{
  var userID = Mongo.ObjectID(req.params.userid);

  trees.find({userid: userID}).toArray((error, userTrees)=>{
    res.render('game/forest', {trees: userTrees, treeHelper: treeHelper}, (error, html)=>{
      res.send(html);
    });
  });
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username: req.body.username}, (error, record)=>{
    if(!error && !record){
      users.save(user, (error, object)=>{
        res.render('game/trade', (error, html)=>{
          var both = {html: html, user: object};
          res.send(both);
        });
      });
    }
    else{
      res.render('game/trade', (error, html)=>{
        var both = {html: html, user: record};
        res.send(both);
      });
    }
  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userid);
  var tree = {};

  tree.height = 0;
  tree.userid = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (error, object)=>{
    res.render('game/tree', {tree: object, treeHelper: treeHelper}, (error, html)=>{
      res.send(html);
    });
  });
};
