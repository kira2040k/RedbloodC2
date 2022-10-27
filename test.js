const zlib = require('zlib');

    
const main = async ()=>{
    let un = await compress("aAAsac cc Hi")
    un = await uncompress(un)
    console.log(await un)
}
main()


// console.log("Data after compression:\n")