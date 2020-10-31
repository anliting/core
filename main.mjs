import fs from              'fs'
import path from    'path'
import url from     'url'
function importMetaToDir(meta){
    return path.dirname((new url.URL(meta.url)).pathname)
}
function onceSigintOrSigterm(f){
    function g(){
        process.off('SIGINT',g).off('SIGTERM',g)
        f()
    }
    process.on('SIGINT',g).on('SIGTERM',g)
}
async function existFile(p){
    try{
        await fs.promises.stat(p)
        return 1
    }catch(e){
        if(!(e.code=='ENOENT'))
            throw e
    }
}
export default{
    existFile,
    importMetaToDir,
    onceSigintOrSigterm,
}
