var xmlHttp;

if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest;
} else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
}

xmlHttp.onreadystatechange = function(){
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

        loginStatus = JSON.parse(xmlHttp.responseText);

        if (login.status === true) {
            
        }
        //não implementado
        //não é seguro
    }
}