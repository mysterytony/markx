/**
 * This module define all necessary interface to interact with
 * the mongodb database. This module is intent to reduce number
 * of connections and reduce the number of connection strings
 * all over place
 */

const MongodbSetting = {
  connectionString: process.env.OPENSHIFT_MONGODB_DB_URL + '/markx'
};

const MongodbCollections = {
  scannerRuleCollection: 'scannerrule'
};

function GetAllFromCollection(collectionString, successCallback, failureCallback) {
  let MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(MongodbSetting.connectionString, function(err, db) {
    if (err) {
      failureCallback(err);
    }
    db.collection(collectionString).find({}, function(err, result) {
      if (err) {
        failureCallback(err);
      }
      db.close();
      successCallback(result);
    });
  });
  
}

/**
 * @typedef successcallback
 * @param {string} result
 */

/**
 * Get one entry from the collection
 * @param {string} collectionString 
 * @param {successcallback} successCallback 
 * @param {failcallback} failureCallback 
 */
function GetOneFromCollection(collectionString, successCallback, failureCallback) {
  let MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(MongodbSetting.connectionString, function(err, db) {
    if (err) {
      failureCallback(err);
    }
    db.collection(collectionString).findOne({}, function(err, result) {
      if (err) {
        failureCallback(err);
      }
      db.close();
      successCallback(result);
    });
  });
}

module.exports.MongodbCollections = MongodbCollections;
module.exports.GetAllFromCollection = GetAllFromCollection;
module.exports.GetOneFromCollection = GetOneFromCollection;

