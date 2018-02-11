var builder=require('botbuilder');
var restify=require('restify');
var quiz=require('./api');

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

var username="manmeet17";
var index=0;

(function(){
    if(username)
        quiz.getStats(username);
})();

bot.dialog('/',
    function(session){
        session.send("Quizlet Chatbot");
        session.beginDialog('/user');
});

bot.dialog('/user', new builder.IntentDialog()
    .matches(/^yes/i,[
        function(session){
            if(username)
                session.beginDialog('/subject');
            else{
                builder.Prompts.text(session,"What is your quizlet username?")
            }
        },
        function(session,results){
            quiz.getStats(results.response);
            session.beginDialog('/subject');
        }])
    .matches(/^no/i,function(session){
        session.send("Ok bye!");
        session.endConversation;
}));

bot.dialog('/subject',)