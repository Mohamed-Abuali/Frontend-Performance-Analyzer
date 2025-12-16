import {globSync} from "glob"
import {parse} from "@babel/parser"
import path from "path"
import { readFile ,readFileSync} from "fs"
// @ts-ignore
import traverse from "@babel/traverse"

const projectPath = process.cwd()
const files = globSync("src/**/*.{js,jsx,ts,tsx,html}",{
    cwd:projectPath,
    ignore:["node_modules/**", "dist/**"]
})
for(const file of files){
    const path = readFiles(file)
    console.log(path)
    const ats =parseToAST(path)
    console.log(ats)
    analysisCode(ats)
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
function analysisCode(ats:any) {
    traverse(ats,{
        JSXAttribute(path:any){
            if(path.node.name.name === "onClick"){
                if(path.node.values?.expression?.type === "ArrowFunctionExpression"){
                    console.log("⚠ Inline function in JSX")
                }
            }
        }
    })
}