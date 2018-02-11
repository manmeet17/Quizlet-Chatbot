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

var bot=new builder.UniversalBot(connector);

var username;
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
            session.send(results.response);
            quiz.getStats(results.response);
            session.beginDialog('/subject');
        }])
    .matches(/^no/i,function(session){
        session.send("Ok bye!");
        session.endConversation;
}));

bot.dialog('/subject', [
    function (session) {
       setTimeout(function(){
        builder.Prompts.text(session, "What study set would you like today?" + quiz.Sets);
        }, 2000)
    },
    function (session, results) {
        quiz.GetTerms(results.response);
        session.send("Ok! I got your flashcards! Send 'ready' to begin. Send 'flip' for definition. Send 'next' for the next card. Send 'exit' when you are done")
        session.beginDialog('/study')
    }]
);

bot.dialog('/study', new builder.IntentDialog()
.matches(/^ready/i, [
    function (session) {
        session.send(quiz.Terms[index])
    }])
.matches(/^flip/i, [
    function (session) {
        session.send(quiz.Def[index])
    }]
)
.matches(/^next/i, [
    function (session) {
        if (++index == quiz.Terms.length)
            session.send("You are all out of cards! Hope you had fun studying! :)")
        else
            session.send(quiz.Terms[index])
    }])
 .matches(/^exit/i, [
    function (session) {
        session.send("Hope you had fun studying. See ya later :)")
    }]
)

);