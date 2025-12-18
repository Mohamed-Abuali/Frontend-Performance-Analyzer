import {globSync} from "glob"
import {parse} from "@babel/parser"
import path from "path"
import { readFile ,readFileSync} from "fs"
//import * as Rules from "./rules.json"
// @ts-ignore
import traverse from "@babel/traverse"

type issue = {
    rule:string;
    message:string;
    file:string;
    line:number;
    level:string;
    category:string;
}
const issues:issue[] = []
const Rules = JSON.parse(readFileSync(path.join(process.cwd(), "rules.json"), "utf-8")).rules
const projectPath = process.cwd()
const files = globSync("src/**/*.{js,jsx,ts,tsx}",{
    cwd:projectPath,
    ignore:["node_modules/**", "dist/**"]
})
for(const file of files){
    const codePath = readFiles(file)

    const ats =parseToAST(codePath)
    //console.log(ats)
    analysisCode(ats,file)
    console.log(issues)
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
            for(const rule of Rules){
                const attrName = path.node.name?.name;
                if (!attrName) continue;
                
                if(rule["attributeNames"].includes(attrName) && path.node.value?.expression?.type === rule["expressionType"]){
                    issues.push({
                        rule:rule["ruleName"],
                        message:rule["message"],
                        file,
                        line:path.node.loc?.start.line ?? 0,
                        level:rule["severity"],
                        category:rule["category"]
                    })
                }
            }
         
        }
    })
}