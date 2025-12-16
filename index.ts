import {globSync} from "glob"
import {parse} from "@babel/parser"
import path from "path"
import { readFile ,readFileSync} from "fs"
// @ts-ignore
import traverse from "@babel/traverse"

type issue = {
    rule:string;
    message:string;
    file:string;
    line:number;
}
const issues:issue[] = []


const projectPath = process.cwd()
const files = globSync("src/**/*.{js,jsx,ts,tsx}",{
    cwd:projectPath,
    ignore:["node_modules/**", "dist/**"]
})
for(const file of files){
    const codePath = readFiles(file)
    console.log(codePath)
    const ats =parseToAST(codePath)
    console.log(ats)
    analysisCode(ats,file)
}

function readFiles(file:string){
const filePath = path.join(projectPath,file)
const code = readFileSync(filePath,"utf-8")
return code;
}
function parseToAST(code:string){
const ats = parse(code,{
    sourceType:"module",
    plugins:["typescript","jsx"],
    errorRecovery:true,
})
return ats;
}
function analysisCode(ats:any,file:string) {
    
    traverse(ats,{
        JSXAttribute(path:any){
            if(path.node.name.name === "onClick" && path.node.value?.expression?.type === "ArrowFunctionExpression"){
               issues.push({
                rule:"",
                message:"",
                file,
                line:path.node.loc?.start.line ?? 0
               })
                
                
            }
        }
    })
}