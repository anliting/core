import fs from'fs'
import main from'./main.mjs'
;(async()=>{
    await fs.promises.writeFile('test','')
    if(await main.existFile('test'))
        console.log(1)
    else
        console.log(0)
    await fs.promises.unlink('test')
})()
