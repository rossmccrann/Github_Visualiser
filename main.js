$(function(){
    var username = $('#otherUsername').val("");
});

var publicRepoNum = 0;
var privateRepoNum = 0;
var totalRepoNum = publicRepoNum + privateRepoNum;
var username, password;
var repoCache = {};


function logIn(){

    username = $('#username').val();
    password = $('#password').val();


    authorisedAccess(

        "https://api.github.com/user",

        (result) => {

            $('.loginHolder').addClass('shrunk');
            $('#content').removeClass('invisible');

            $("#profileImage").attr("src", result.avatar_url);
            $("#profileName").text("\tUsername: " + result.login);
            $("#profileFollowersNum").text("\tTotal Followers: " + result.followers);
            $("#profileFollowingNum").text("\tTotal Following: " + result.following);
            $("#profilePublicRepoNum").text("\tTotal Public Repos: " + result.public_repos);
            $("#profilePrivateRepoNum").text("\tTotal Private Repos: "+ result.total_private_repos);
            publicRepoNum = result.public_repos;
            privateRepoNum = result.total_private_repos;

            loadMyReposList();

        },

        (error) => {
        }
    );

}

function loadMyReposList(){


    var url = "https://api.github.com/user/repos";

    var cached = repoCache[url];

    if(cached != null){
        console.log('Cache hit!');
        onSuccess(cached);
    } else authorisedAccess(

        url,

        (result) => {

            extractRepos(result, "#myRepos", "Looks like you don't have any repos");
            if(result.length != 0) selectedRepo(result[1].url);



        },

        (error) => {
        }
    );
}

function loadOtherReposList(username){


    var url = "https://api.github.com/users/" + username + "/repos";
    var url2 = "https://api.github.com/users/" + username;
    var cached = repoCache[url];

    if(cached != null){
        console.log('Cache hit!');
        onSuccess(cached);


    } else authorisedAccess(

        url,

        (result) => {
            statusHide();
            clearOtherRepos();
            clearMyRepos();

            extractRepos(result, "#myRepos", "Looks like " + username + " doesn't have any public repos");
        },

        (error) => {
            clearOtherRepos();

            var t = "The user " + username + " doesn't exist";
            if(error.status != 404) t = "Failed to load " + username + "'s repos";

        }
    );

    authorisedAccess(

        url2,

        (result) => {


            $("#profileImage").attr("src", result.avatar_url);
            $("#profileName").text("\tUsername: " + result.login);
            $("#profileFollowersNum").text("\tTotal Followers: " + result.followers);
            $("#profileFollowingNum").text("\tTotal Following: " + result.following);
            $("#profilePublicRepoNum").text("\tTotal Public Repos: " + result.public_repos);
            $("#profilePrivateRepoNum").text("\tTotal Private Repos: "+ result.total_private_repos);
            publicRepoNum = result.public_repos;
            privateRepoNum = result.total_private_repos;
          },





        (error) => {
        }
      );


}

function extractRepos(result, addTo, messageIfEmpty){

    var l = result.length;

    if(l == 0){
        $(addTo).append("<p>" + messageIfEmpty + "</p>");
    } else {
        for(i = 0; i < l; i++){
            addRepoTo(addTo, result[i].name, result[i].url);
            repoCache[result[i].url] = result[i];
        }
    }

}

function search(){

    var username = $('#otherUsername').val();

    clearOtherRepos();
    setOtherReposMessage("Loading " + username + "'s repos...");

    loadOtherReposList(username);

}

function clearOtherRepos(){
    $("#otherRepos > a").remove();
    $("#otherRepos p").remove();
}

function clearMyRepos(){
    $("#myRepos > a").remove();
    $("#myRepos p").remove();
}

function setOtherReposMessage(message){
    $("#otherRepos").append("<p>" + message + "</p>");
}

function authorisedAccess(url, onSuccess, onFail){

    var auth = btoa(username + ":" + password);

    $.ajax({

        headers: {'Authorization' : 'Basic ' + auth},
        url: url,
        success: onSuccess,
        error: onFail

    })

}

function addRepoTo(divName, repoName, repoLink){

    $(divName).append('<a href="javascript:selectedRepo(\'' + repoLink + '\')" class="repoClicker">' + repoName + '</a>');

}

function selectedRepo(url){


    $('a.repoClicker').removeClass("selected"); // Remove all old selections.
    $('a.repoClicker[href="javascript:selectedRepo(\'' + url + '\')"]').addClass("selected"); // Set the link with this url as the selection.

    authorisedAccess(
        url,

        (result) => {

            handleCommitHistory(result.commits_url.replace("{/sha}", ""));

        },

        (error) => {
        }
    )
}



$(document).keydown(function(e) {
    if(e.which == 37) left();
    if(e.which == 39) right();
});
