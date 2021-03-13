import fs from      'fs'
import path from    'path'
import url from     'url'
function content(s){
    return new Promise((rs,rj)=>{
        let a=[]
        s.on('data',a.push.bind(a))
        s.on('end',()=>{rs(Buffer.concat(a))})
        s.on('error',rj)
    })
}
async function createReadStream(p){
    let fh
    try{
        fh=await fs.promises.open(p,'r')
    }catch(e){
        throw['ENOENT'].includes(e.code)?createReadStream.badPath:e
    }
    if(!(await fh.stat()).isFile()){
        fh.close()
        throw createReadStream.badPath
    }
    return fs.createReadStream(0,{fd:fh.fd,autoClose:false}).on('end',()=>
        fh.close()
    )
}
createReadStream.badPath=Symbol()
async function existFile(p){
    try{
        await fs.promises.stat(p)
        return 1
    }catch(e){
        if(!(e.code=='ENOENT'))
            throw e
    }
}
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
export{
    content,
    createReadStream,
    existFile,
    importMetaToDir,
    onceSigintOrSigterm,
}
export default{
    content,
    createReadStream,
    existFile,
    importMetaToDir,
    onceSigintOrSigterm,
}
