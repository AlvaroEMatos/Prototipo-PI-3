function formsIsValid () {
    const checkboxes = $('input[type="checkbox"]');
    var cont = 0;

    if(checkboxes.length) {
        if(checkboxes.is(":checked")){
            cont++;
        }
    }
    
    //não implementado
}