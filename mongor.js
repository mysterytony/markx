/**
 * This module define all necessary interface to interact with
 * the mongodb database. This module is intent to reduce number
 * of connections and reduce the number of connection strings
 * all over place
 */

const MongodbSetting = {
  connectionString: 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb'
};

const MongodbCollections = {
  scannerRuleCollection: 'scannerrule'
};