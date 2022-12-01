class randmonint {
    randmon (){
        const length = Math.floor(Math.random() *  10) + 5
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

random_int =(str) => {
       const list = ["kiraRadomint1","kiraRadomint2","kiraRadomint3","kiraRadomint4","kiraRadomint5","kiraRadomint6","kiraRadomint7","kiraRadomint8","kiraRadomint9","kiraRadomint10"]
        for(var i=0;i<list.length;i++) {
            str = str.replaceAll(list[i],this.randmon())
        }
        return str

    } 

}
const handle_randmon_int = new randmonint();
res = handle_randmon_int.random_int("kiraRadomint1asd")
