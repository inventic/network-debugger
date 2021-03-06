(function () {
  "use strict";
  var fs = require('fs')
    , mkdirp = require('mkdirp')
    , path = require('path')
    ;

  function getTimeString() {
    var date = new Date()
      , year = date.getFullYear()
      , month = ('0'+(date.getMonth()+1)).slice(-2)
      , day = ('0'+date.getDate()).slice(-2)
      , hours = ('0'+date.getHours()).slice(-2)
      , minutes = ('0'+date.getMinutes()).slice(-2)
      , seconds = ('0'+date.getSeconds()).slice(-2)
      , milliseconds = ('00'+date.getMilliseconds()).slice(-3)
      ;

    return year+'-'+month+'-'+day+'_'+hours+'-'+minutes+'-'+seconds+'-'+milliseconds;
  }

  //Make directory for logger
  function mkdir(logpath) {
    mkdirp(path.resolve(logpath));
  }

  function writeData(dirname, data) {
    var filename
      , ext = '.txt'
      ;

    if (data.indexOf("<kml") !== -1) {
      ext = '.kml';
    }
    else if (data.indexOf("<html") !== -1) {
      ext = '.html';
    }
    else if (data.indexOf("<xml") !== -1) {
      ext = '.xml';
    }
    else {
      try {
        JSON.parse(data);
        ext = '.json';
      }
      catch (err) {
        // do nothing
      }
    }

    filename = path.resolve(dirname, getTimeString() + ext);
    fs.writeFile(filename, data , function (err) {
      if (err) {
        throw err;
      }
    });
  }

  module.exports.mkdir = mkdir;
  module.exports.writeData = writeData;

}());
