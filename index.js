var builder=require('botbuilder');
var restify=require('restify');

var server=restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log("%s listening to %s",server.name,server.url);
});

var connector=new builder.ChatConnector({
    appId: "1ab22930-0ab2-4fcb-9518-cd8b962439a1",
    appPassword: "qlkfNXQ56!^+fsqTUXV293!"
});

server.post('/api/messages',connector.listen())

var bot=new builder.UniversalBot(connector,function(session){
    session.send("You said %s",session.message.text);
});