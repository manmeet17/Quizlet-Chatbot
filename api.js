var request=require('request')

const api="Df8sZMMA8Y";
exports.getStats=function(user,callback){
    request.get({
        uri: 'https://api.quizlet.com/2.0/users/' + user + '/sets?client_id='+api,
    },
    function(err,res,body){
        if(err)
            callback(err);
        else{
            body=JSON.parse(body);
            for(var x=0;x<body.length;x++){
                if((x+1)==body.length){
                    sets=sets+body[x].title;
                } else{
                    sets=sets+body[x].title+',';
                }
                table[body[x].title]=body[x].id;
            }
            console.log("Got sets")
            exports.Set=sets;
        }
    })
}

exports.getTerms=function(key,callback){
    var terms=[];
    var def=[];
    request.get({
        uri: 'https://api.quizlet.com/2.0/sets/' + table[key] + '?client_id='+api
    },
    function(err,res,body){
        if(err)
            console.log(err);
        else{
            body=JSON.parse(body);
            for (var i=0;i<body.length;i++){
                terms.push(body.terms[x].term);
                def.push(body.terms[x].definition);
            }
            console.log("Got terms");
            exports.Terms=terms;
            exports.Def=def;
        }
    })
}