'use strict';

function getClass(height){
  if(height ===0){
    return 'seed';
  }

  if(height <= 12){
    return 'sapling';
  }

  if(height <= 48){
    return 'teenager';
  }

  return 'adult';
}

exports.getClass = getClass;
