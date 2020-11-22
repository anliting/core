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
async function fsyncByPath(p){
    let h=await fs.promises.open(p)
    await h.sync()
    await h.close()
}
async function fsyncWithParentByPath(p){
    await Promise.all([
        fsyncByPath(path.resolve(p,'..')),
        fsyncByPath(p),
    ])
}
function importMetaToDir(meta){
    return path.dirname((new url.URL(meta.url)).pathname)
}
async function mkdirFsync(p){
    await fs.promises.mkdir(p)
    await fsyncWithParentByPath(p)
}
function onceSigintOrSigterm(f){
    function g(){
        process.off('SIGINT',g).off('SIGTERM',g)
        f()
    }
    process.on('SIGINT',g).on('SIGTERM',g)
}
async function renameFsync(a,b){
    await fs.promises.rename(a,b)
    await fsyncByPath(a)
}
export default{
    content,
    createReadStream,
    existFile,
    fsyncByPath,
    fsyncWithParentByPath,
    importMetaToDir,
    mkdirFsync,
    onceSigintOrSigterm,
    renameFsync,
}
