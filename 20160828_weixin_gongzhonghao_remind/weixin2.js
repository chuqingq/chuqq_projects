var process = require('process');
var MongoClient = require('mongodb').MongoClient;
var wechat = require('wechat');
var weapi = require('wechat-api');
var connect = require('express');
var app = connect();

process.on('uncaughtException', function(err) {
    console.log('uncaughtException:', err);
});

var config = {
  token: 'chuqq',
  appid: 'wx0288bf03ed5da89b',
  appsecret: 'd4624c36b6795d1d99dcf0547af5443d'
};

var api = new weapi(config.appid, config.appsecret);

var collection;

// 打开mongo，并删除已超期的任务
MongoClient.connect('mongodb://localhost:27017/weixin', function(err, db) {
  console.log("MongoClient.connect error:", err);
  collection = db.collection('remind');

  // 每10秒，遍历mongo中过期的数据，并发送提醒
  setInterval(function() {
    // console.log('setInterval')
    if (collection == null) return;
    collection.find({time: {$lt: new Date()}}).toArray(function(err, docs) {
      if (err != null) {
        console.log('collection find error:', err);
        return;
      }
      // console.log('docs:', docs);
      docs.forEach(function(doc) {
        console.log('send doc:', doc);
        api.sendText(doc.user, doc.content, function(err, data, res) {
          console.log('api.sendText: err:', err, 'data:', data, 'res:', res);
          if (err == null) collection.removeOne({_id: doc._id}, function() {
            console.log('delete doc:', doc);
          });
        });
        // 哈哈
        if (doc.content.indexOf('徐文涛') >= 0) {
          api.sendText('oLo4_weWRtRrGXLlG_9rbUrOIZRk', doc.content, function(err, data, res) {
          });
        }
      });
    });
  }, 10*1000);
});

app.use(connect.query());
app.use('/wechat', wechat(config, wechat.text(function(message, req, res, next) {
  console.log('/wechat text:', message.Content);
  handleMsg(message.FromUserName, message.Content, res);
}).voice(function(message, req, res, next) {
  console.log("/wechat voice:", message.Recognition);
  handleMsg(message.FromUserName, message.Recognition, res);
})));

// text和voice均调此接口处理remind消息
function handleMsg(user, content, res) {
  var opts = {
    "query":content,
    "city":"南京",
    "category": "remind"
  };

  api.semantic(user, opts, function(err, data, res2) {
    console.log('semantic result: ', data);
    if (err != null
      || data == undefined
      || data.semantic == undefined
      || data.semantic.details == undefined
      || data.semantic.details.datetime == undefined) {
        res.reply('未知错误: ' + err + '.\n' + content);
        return;
    }
    var datetime = data.semantic.details.datetime.date + ' ' + data.semantic.details.datetime.time;
    var datetime2 = new Date(datetime);
    if (datetime2.toString() == 'Invalid Date') {
      res.reply('时间格式非法\n');
      return;
    }

    if (datetime2 < new Date()) {
      res.reply('时间已过期');
      return;
    }

    // 插入数据库中
    var doc = {time: datetime2, user: user, content: content};
    collection.insert(doc, function(err) {
      console.log('insert doc:', doc, '::', err);
      if (err == null) res.reply('定时提醒设置成功：\n'+datetime+'\n'+content);
    });
  });
}

// 启动服务
var server = app.listen(80, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('weixin app listening at http://%s:%s', host, port);
});

