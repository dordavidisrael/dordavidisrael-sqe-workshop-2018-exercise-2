import * as esprima from 'esprima';

let dok=[];
let input;
let zzzfff=1;
let stop=0;
let flag;
let stopLines=[];
let dictionary = {}, dictionaryLocal={}, dictionarySecondPlace={};

const parseCode = (codeToParse) => {
    dok=codeToParse.split('\n');
    flag=0;
    dictionary = {};
    dictionaryLocal={};
    dictionarySecondPlace={};
    return esprima.parseScript(codeToParse,{loc:true});
};
const parseCode0 = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};
const parseCode1 = (codeToParse) => {
    input=codeToParse.split('\n');
    return esprima.parseScript(codeToParse,{loc:true});
};
const updata = ()=>{zzzfff=zzzfff+1;};

const StartFunc=(code1, args)=> {
    let code;
    stopLines=[];
    let lines=[]; stop=0;
    let condition=[];
    code1.body.forEach(function(element) {
        if(element.type==='FunctionDeclaration'){
            code=element;
        }
    });
    Global_handle(code1.body,lines);
    if(code) {
        let params = code.params;
        if (params.length > 0) {params_handle(params, args);}
        let realBody = code.body.body;
        mainfunc(realBody, lines, condition,100);
        lines.push('}');
    }return TextColor(lines);
};
const mainfunc=(code, lines, condition)=>{
    code.forEach(function(element) {

        if(element.type==='VariableDeclaration'){
            func_variableDec(element);
        }

        else if(element.type==='ExpressionStatement'){
            func_assigmentExp(element,lines);
        }

        else if(element.type==='IfStatement'){
            func_if(element, lines, condition);
        }
        else {mainfunc1(element, code, lines, condition);}
    });
};
const mainfunc1= (element, code, lines, condition)=>{
    if(element.type==='WhileStatement'){
        func_while(element, lines, condition);
    }
    else{
        //if(element.type==='ReturnStatement')
        func_return(element,lines);
    }

};

const Global_handle=(x, lines)=>{
    let k='';
    x.forEach(function(element) {
        if(element.type==='VariableDeclaration'){
            VariableDecGlobal(element);
            lines.push(dok[element.loc.start.line-1]);
        }
        if(element.type==='ExpressionStatement'){
            Expression_Global(element);
            lines.push(dok[element.loc.start.line-1]);
        }
        if(element.type==='FunctionDeclaration'){
            updata();
            k=dok[element.loc.start.line-1];
        }
    });
    if(!(k==='')){lines.push(k);}
};
const params_handle=(params,arg)=>{
    let i=0;
    let args=arg.body[0].expression.expressions;
    if(!args){
        let z=arg.body[0].expression;
        args = [];
        args.push(z);
    }
    params.forEach(function(entry) {
        if(entry.type==='Identifier'){
            let n=entry.name;
            let v = Args_handle(args[i]);
            if(args[i].type==='ArrayExpression'){ArrayToDic(v,n);}
            dictionary[n]=v;
            i++;
        }
        else{i++;}
    });
};
const Args_handle=(elem)=>{
    if(elem.type==='Literal'){return(elem.value);}
    //else if(elem.type==='Identifier'){return(elem.name);}
    else if(elem.type==='BinaryExpression'){return(input[elem.loc.start.line-1].substring(elem.loc.start.column,elem.loc.end.column));}
    else if(elem.type==='ArrayExpression'){return(input[elem.loc.start.line-1].substring(elem.loc.start.column,elem.loc.end.column));}
    else{ //(elem.type==='UnaryExpression')
        return('-'+input[elem.argument.loc.start.line-1].substring(elem.argument.loc.start.column,elem.loc.end.column));
    }
};
const ArrayToDic=(elem,name)=>{
    elem=elem.replace('[','');
    elem=elem.replace(']','');
    let arr=elem.split(',');
    for(let i=0;i<arr.length;i++){
        dictionary[name+'['+i+']']=arr[i];
    }
};

const getValue=(value)=>{
    let t;
    if(dictionary.hasOwnProperty(value)){return value;}
    t=dictionarySecondPlace[value];
    if(dictionarySecondPlace.hasOwnProperty(value)){return t;}
    return getValue2(value);
};
const getValue2=(value)=>{
    return dictionaryLocal[value];
};
const getValue_number=(value)=>{
    let t;
    t=dictionarySecondPlace[value];
    if(dictionarySecondPlace.hasOwnProperty(value)){return t;}
    t=dictionary[value];
    return t;
};



/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const VariableDeclaration =(entry)=>{
    entry.declarations.forEach(function(element) {
        if((!(element.init))){VariableDeclaration_let(element);}
        else if(element.init.type==='Literal'){VariableDeclaration_Literal(element);}
        else if(element.init.type==='Identifier'){VariableDeclaration_Identifier(element);}
        else {VariableDeclaration1(element);}
    });
};
const VariableDeclaration1=(element)=>{
    if((element.init.type === 'BinaryExpression')) {variable_dec_binary(element);}
    else if(element.init.type==='UnaryExpression'){VariableDeclaration_unary(element);}
    else if(element.init.type==='ArrayExpression'){VariableDeclaration_Array(element);}
    else if(element.init.type==='MemberExpression'){VariableDeclaration_Member_Expression(element);}
};

const VariableDeclaration_let=(entry)=>{
    let n=entry.id.name;
    dictionaryLocal[n]='';
};
const VariableDeclaration_Literal=(entry)=>{
    let n = getName(entry.id);
    dictionaryLocal[n]=TakeCareLiteral(entry.init);
};
const VariableDeclaration_Identifier=(entry)=>{
    let n = getName(entry.id);
    let k=TakeCareIden(entry.init);
    dictionaryLocal[n]=getValue(k);
};

const variable_dec_binary=(entry)=>{
    dictionaryLocal[getName(entry.id)]=binaryEXPsolve(entry);
};
const binaryEXPsolve=(entry)=>{
    let arr=[];
    let arr1=[];
    let s='';
    binaryEXPsolve_helper(entry.init,arr);
    for(let i=0;i<arr.length;i=i+2) {
        if (arr[i].type === 'Literal') {
            arr1[i] = arr[i].value;
        }
        else {binaryEXPsolve1(entry,arr,arr1,i);}
        s=s+arr1[i]+' ';
        if(!(i===arr.length-1)){s=s+arr[i+1]+' ';}
    }
    return s;
};
const binaryEXPsolve_helper=(entry,arr)=>{
    if(entry.left.type==='BinaryExpression'){
        binaryEXPsolve_helper(entry.left,arr);
        arr.push(entry.operator);
        arr.push(entry.right);
    }
    else{
        arr.push(entry.left);
        arr.push(entry.operator);
        arr.push(entry.right);
    }
};
const binaryEXPsolve1=(entry,arr,arr1,i)=>{
    if (arr[i].type === 'Identifier') {
        arr1[i] = getValue([arr[i].name]);
    }
    else if (arr[i].type === 'UnaryExpression') {
        arr1[i] = Exp_unary_solver(arr[i].argument);
    }
    else if (arr[i].type === 'BinaryExpression') {
        arr1[i] = vdBinMemeber(arr[i]);
    }
    else if (arr[i].type === 'MemberExpression') {
        arr1[i] = getValue(memberExpression_solver(arr[i]));
    }

};

const VariableDeclaration_unary=(entry)=>{
    let n = getName(entry.id);
    dictionaryLocal[n]=variable_dec_unarySolver(entry.init.argument);
};
const variable_dec_unarySolver=(element)=>{
    let s='';
    let v=[];
    if(element.type==='Literal'){v.push(element.value);}
    else if(element.type==='Identifier'){v.push(getValue([element.name]));}
    else{variable_dec_unarySolver1(element,v);}
    for(let i=0;i<v.length;i++){
        s=s+v[i];
    }
    return '- ( '+s+' ) ';
};
const variable_dec_unarySolver1=(element,v)=>{
    if(element.type==='BinaryExpression'){v.push(vdBinMemeber(element));}
    else if(element.type==='MemberExpression'){v.push(getValue([memberExpression_solver(element)]));}
};

const VariableDeclaration_Array=(element)=>{
    let n= getName(element.id);
    let v=dok[element.loc.start.line-1].substring(dok[element.loc.start.line-1].indexOf('=')+1);
    v=v.substring(0,v.indexOf(';'));
    dictionaryLocal[n]=v;
    v=v.replace('[','');
    v=v.replace(']','');
    let arr=v.split(',');
    for(let i=0;i<arr.length;i++){
        dictionaryLocal[n+'['+i+']']=arr[i];
    }
};

const VariableDeclaration_Member_Expression=(element)=>{
    let v=memberExpression_solver(element.init);
    let n=getName(element.id);
    dictionaryLocal[n]=getValue(v);

};
const memberExpression_solver=(element)=>{
    let v=[];
    v.push(getName(element.object));
    v.push('[');
    let s='';
    if(element.property.type==='Literal'){v.push(element.property.value);}
    else if(element.property.type==='Identifier'){v.push(getValue([element.property.name]));}
    else {v.push(vdBinMemeber(element.property));}
    v.push(']');
    for(let i=0;i<v.length;i++){
        s=s+v[i];
    }
    return s;
};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/





/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const ExpressionState=(entry,lines)=>{
    if(entry.expression.right.type==='Literal'){ExpressionState_Literal(entry,lines);}
    else if(entry.expression.right.type==='Identifier'){ExpressionState_Identifier(entry,lines);}
    else{ExpressionState1(entry,lines);}
};
const ExpressionState1=(entry,lines)=>{
    if(entry.expression.right.type==='MemberExpression'){ExpressionState_Member(entry,lines);}
    else if(entry.expression.right.type==='BinaryExpression'){ExpressionState_binary(entry,lines);}
    else if(entry.expression.right.type==='UnaryExpression'){ExpressionState_unary(entry,lines);}
    else if(entry.expression.right.type==='ArrayExpression'){ExpressionState_array(entry,lines);}
};
/*--------------------------------------------------------------------------------------------------------*/
const ExpressionState_Literal=(entry,lines)=>{
    let n=getName(entry.expression.left);
    let v=TakeCareLiteral(entry.expression.right);
    dictionarySecondPlace[n]=v;
    if(dictionary.hasOwnProperty(n)){
        lines.push(dok[entry.loc.start.line-1].substring(0,entry.expression.left.loc.end.column)+'='+v+';');
        dictionary[n]=v;
    }
};
const ExpressionState_Identifier=(entry,lines)=>{
    let n=getName(entry.expression.left);
    let v=TakeCareIden(entry.expression.right);
    dictionarySecondPlace[n]=getValue(v);
    if(dictionary.hasOwnProperty(n)){
        lines.push(dok[entry.loc.start.line-1].substring(0,entry.expression.left.loc.end.column)+'='+v+';');
        dictionary[n]=interpetexp(v);
    }
};
/*--------------------------------------------------------------------------------------------------------*/
const ExpressionState_Member =(entry,lines)=>{
    let v=MemberExp2(entry.expression.right);
    let n=getName(entry.expression.left);
    dictionarySecondPlace[n]=getValue(v);
    if(dictionary.hasOwnProperty(n)){
        lines.push(dok[entry.loc.start.line-1].substring(0,entry.expression.left.loc.end.column)+'='+v+';');
        dictionary[n]=interpetexp(v);
    }
};
const MemberExp2=(element)=>{
    let v=[];
    v.push(getName(element.object));
    v.push('[');
    if(element.property.type==='Literal'){v.push(element.property.value);}
    if(element.property.type==='Identifier'){v.push(getValue([element.property.name]));}
    v.push(']');
    let s='';
    for(let i=0;i<v.length;i++){
        s=s+v[i];
    }
    return s;
};
/*--------------------------------------------------------------------------------------------------------*/
const ExpressionState_binary=(entry,lines)=>{
    let s=Exp_binary_solver(entry);
    dictionarySecondPlace[getName(entry.expression.left)]=s;
    if(dictionary.hasOwnProperty(getName(entry.expression.left))){
        lines.push(dok[entry.loc.start.line-1].substring(0,entry.expression.left.loc.end.column)+'='+s+';');
        dictionary[getName(entry.expression.left)]=interpetexp(s);
    }
};
const Exp_binary_solver=(entry)=>{
    let arr=[];
    let arr1=[];
    let s='';
    binaryEXPsolve_helper(entry.expression.right,arr);
    for(let i=0;i<arr.length;i=i+2) {
        if (arr[i].type === 'Literal') {
            arr1[i] = arr[i].value;
        }
        else{Exp_binary_solver1(entry,arr,arr1,i);}
        s=s+arr1[i]+' ';
        if(!(i===arr.length-1)) {s=s+arr[i+1]+' ';}
    }
    return s;
};
const Exp_binary_solver1=(entry,arr,arr1,i)=>{
    if (arr[i].type === 'Identifier') {
        arr1[i] = getValue(getName(arr[i]));
    }
    else if (arr[i].type === 'UnaryExpression') {
        arr1[i] = Exp_unary_solver(arr[i].argument);
    }
    else if (arr[i].type === 'BinaryExpression') {
        arr1[i] = vdBinMemeber(arr[i]);
    }
    else if (arr[i].type === 'MemberExpression') {
        arr1[i] = getValue(memberExpression_solver(arr[i]));
    }

};
/*--------------------------------------------------------------------------------------------------------*/
const ExpressionState_unary=(entry,lines)=>{
    let n=getName(entry.expression.left);
    let v=Exp_unary_solver(entry.expression.right.argument);
    dictionarySecondPlace[n]=v;
    if(dictionary.hasOwnProperty(n)){
        lines.push(dok[entry.loc.start.line-1].substring(0,entry.expression.left.loc.end.column)+'='+v+';');
        dictionary[n]=interpetexp(v);
    }
};
const Exp_unary_solver=(element)=>{
    let s='';
    let v=[];
    if(element.type==='Literal'){v.push(element.value);}
    else if(element.type==='Identifier'){v.push(getValue([element.name]));}
    else {Exp_unary_solver1(element,v);}
    for(let i=0;i<v.length;i++){s=s+v[i];}
    return '- ( '+s+' ) ';
};
const Exp_unary_solver1=(element,v)=>{
    if(element.type==='BinaryExpression'){v.push(vdBinMemeber(element));}
    if(element.type==='MemberExpression'){v.push(getValue(memberExpression_solver(element)));}
};
/*--------------------------------------------------------------------------------------------------------*/
const ExpressionState_array=(element,lines)=>{
    let n= getName(element.expression.left);
    let v=dok[element.loc.start.line-1].substring(element.expression.right.loc.start.column,element.expression.right.loc.end.column);
    dictionarySecondPlace[n]=v;
    v=v.substring(1);
    v=v.substring(0,v.length-1);
    let arr=v.split(',');
    for(let i=0;i<arr.length;i++){
        dictionarySecondPlace[n+'['+i+']']=arr[i];
    }
    if(dictionary.hasOwnProperty(n)){
        lines.push(dok[element.loc.start.line-1].substring(0,element.expression.left.loc.end.column)+'='+v+';');
    }

};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const interpetexp=(str)=>{
    str=str+' ';
    let arr=str.split(' ');
    for(let i=0;i<arr.length;i++) {
        if (dictionary.hasOwnProperty(arr[i])||dictionarySecondPlace.hasOwnProperty(arr[i])||dictionaryLocal.hasOwnProperty(arr[i])){
            arr[i] = getValue_number2([arr[i]]);
        }
    }
    return interpetexp2(arr);
};
const interpetexp2=(arr)=>{
    let s='';
    for(let i=0;i<arr.length;i++) {
        if(!(arr[i]==='')){
            if(isNaN(arr[i])) {s = s + arr[i];}
            else{
                s=s+arr[i];
            }
        }
    }
    return s;
};
const getValue_number2=(value)=>{
    let t;
    t=dictionarySecondPlace[value];
    if(dictionarySecondPlace.hasOwnProperty(value)){return t;}
    t=dictionaryLocal[value];
    if(dictionaryLocal.hasOwnProperty(value)){return t;}
    t=dictionary[value];
    return t;
};



/* XXXXXXXXXXXXXX IF Statement XXXXXXXXXXXXXXXX*/
/*--------------------------------------------------------------------------------------------------------*/
const firstif=(entry, lines, condition)=>{
    let operator = entry.test.operator;
    let left=HandleIF(entry.test.left);
    let right=HandleIF(entry.test.right);
    let lef=interpet(left);
    let righ=interpet(right);
    lef=checkstring(lef);
    righ=checkstring(righ);
    let linew=dok[entry.loc.start.line-1].substring(0,dok[entry.loc.start.line-1].indexOf('(')+1);
    linew+=left+operator+right+dok[entry.loc.start.line-1].substring(dok[entry.loc.start.line-1].indexOf(')'));
    let conditioneval=lef+operator+righ;
    condition.push(conditioneval);
    let ans = eval(conditioneval);
    checkif(ans,entry, lines,linew);
    if(entry.consequent.body){mainfunc(entry.consequent.body, lines, condition);lines.push('}');}
    else{let a=[];
        a.push(entry.consequent);
        mainfunc(a,lines, condition);
    }
};
const checkif=(ans,entry, lines,linew)=>{
    if(stop === 0&&!stopLines.includes(entry.loc.start.line)){
        if (!ans) {
            lines.push('$' + linew);
            updateBedLines(stopLines,entry.consequent.loc.start.line,entry.consequent.loc.end.line);
        }
        else {
            lines.push('@' + linew);
            checkReturn(entry);
            flag=1;
        }
    }
    else{lines.push(linew);}
};
/*--------------------------------------------------------------------------------------------------------*/
const recursivElse=(entry, lines, condition)=>{
    if(entry.type==='IfStatement') {
        let old = copyDIC(dictionarySecondPlace);let old1=copyDIC(dictionary);
        justEllseif(entry, lines, condition);
        dictionarySecondPlace=old;dictionary=old1;
        if (entry.alternate) {
            if (entry.alternate.type === 'IfStatement'){recursivElse(entry.alternate, lines, condition);}
            else {
                let old1=copyDIC(dictionarySecondPlace);let old11=copyDIC(dictionary);
                justElse(entry.alternate, lines, condition);
                dictionarySecondPlace=old1;dictionary=old11;
            }
        }
    }
    else {
        let old=copyDIC(dictionarySecondPlace); let old1=copyDIC(dictionary);
        justElse(entry, lines, condition);
        dictionarySecondPlace=old;dictionary=old1;
    }
};
/*--------------------------------------------------------------------------------------------------------*/
const justElse=(entry, lines, condition)=>{
    lines.push('else');
    let a=[];
    if(entry.type==='BlockStatement') {
        lines.push('{');
        mainfunc(entry.body,lines,condition);
        lines.push('}');
    }
    else{
        a.push(entry);
        mainfunc(a,lines,condition);
    }
};
const justEllseif=(entry, lines, condition)=>{
    let operator = entry.test.operator;
    let left=HandleIF(entry.test.left);
    let right=HandleIF(entry.test.right);
    let lef=interpet(left);
    let righ=interpet(right);
    lef=checkstring(lef);
    righ=checkstring(righ);
    let linew=dok[entry.loc.start.line-1].substring(0,dok[entry.loc.start.line-1].indexOf('(')+1);
    linew+=left+operator+right+dok[entry.loc.start.line-1].substring(dok[entry.loc.start.line-1].indexOf(')'));

    checkElseIf(lef,righ,operator,condition,entry, lines,linew);
    if(entry.consequent.type==='BlockStatement') {mainfunc(entry.consequent.body,lines,condition);lines.push('}');}
    else{let a=[];
        a.push(entry.consequent);
        mainfunc(a,lines,condition);
    }
};
/*--------------------------------------------------------------------------------------------------------*/
const checkElseIf=(lef,righ,operator,condition,entry, lines,linew)=>{
    let c=lef+operator+righ;
    condition.push(c);
    let ans = eval(c);
    if(stop === 0&&!stopLines.includes(entry.loc.start.line)&&flag===0){
        if (!ans) {
            lines.push('$' + linew);
            updateBedLines(stopLines,entry.consequent.loc.start.line,entry.consequent.loc.end.line);
        }
        else {
            lines.push('@' + linew);
            checkReturn(entry);
            flag=1;
        }
    }
    else{lines.push(linew);}
};
/*--------------------------------------------------------------------------------------------------------*/
const HandleIF=(entry)=>{
    if(entry.type==='Literal'){return entry.value;}
    else if(entry.type==='Identifier'){return getValue([entry.name]);}
    else if(entry.type==='BinaryExpression'){return vdBinMemeber(entry);}
    else { return HandleIF2(entry);}
};
const HandleIF2=(entry)=>{
    if(entry.type==='MemberExpression'){
        let z= memberExpression_solver(entry);
        let str = z.substring(z.indexOf('[')+1,z.indexOf(']'));
        str=parseCode0(str);
        let k=getValue(z);
        if(!(k===undefined)){return k;}
        if(str.body[0].expression.type==='BinaryExpression'){
            let temp=vdBinMemeber(str.body[0].expression);
            temp=interpet(temp);
            let k=calculateNum(temp);
            let nam=entry.object.name+'['+k+']';
            return getValue(nam);
        }
    }
    else{//if(entry.type==='UnaryExpression')
        return Exp_unary_solver(entry.argument);
    }
};
/*--------------------------------------------------------------------------------------------------------*/
const interpet=(str)=>{
    str=str+' ';
    let arr=str.split(' ');
    for(let i=0;i<arr.length;i++) {
        if (dictionary.hasOwnProperty(arr[i])) {
            arr[i] = dictionary[arr[i]];
        }
    }
    return interpet2(arr);
};
const interpet2=(arr)=>{
    let s='';
    for(let i=0;i<arr.length;i++) {
        if(!(arr[i]==='')){
            if(isNaN(arr[i])) {s = s + arr[i];}
            else{
                s=s+arr[i];
            }
        }
    }
    return s;
};
/*--------------------------------------------------------------------------------------------------------*/
const checkReturn=(entry)=>{
    let a;
    if(entry.consequent.body){a=entry.consequent.body;}
    else{a=[];
        a.push(entry.consequent);
    }
    a.forEach(function(element) {
        if(element.type==='ReturnStatement'){
            updateBedLines(stopLines,element.loc.start.line,100);
        }
    });
};
const checkReturn1=(entry)=>{
    let a;
    if(entry.body.body){a=entry.body.body;}
    else{a=[];
        a.push(entry.body);
    }
    a.forEach(function(element) {
        if(element.type==='ReturnStatement'){
            updateBedLines(stopLines,element.loc.start.line,100);
        }
    });
};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/




const func_variableDec =(entry)=>{
    VariableDeclaration(entry);
};
const  func_assigmentExp=(entry,lines)=>{
    ExpressionState(entry,lines);
};
const func_if=(element, lines, condition)=>{
    let old = copyDIC(dictionarySecondPlace);
    let old1=copyDIC(dictionary);
    firstif(element, lines, condition);
    dictionarySecondPlace=old;
    dictionary=old1;
    if(element.alternate) {
        recursivElse(element.alternate, lines, condition);
    }
    flag=0;

};
const func_while=(entry, lines, condition)=>{
    let old = copyDIC(dictionarySecondPlace);
    let old1=copyDIC(dictionary);
    StateWhile(entry, lines, condition);
    dictionarySecondPlace=old;
    dictionary=old1;
};
const func_return=(element,lines)=>{
    StateRetrun(element,lines);
};
const StateWhile=(entry, lines, condition)=>{
    let operator = entry.test.operator;
    let left=HandleIF(entry.test.left);
    let right=HandleIF(entry.test.right);
    let linew=dok[entry.loc.start.line-1].substring(0,dok[entry.loc.start.line-1].indexOf('(')+1);
    linew+=left+operator+right+dok[entry.loc.start.line-1].substring(dok[entry.loc.start.line-1].indexOf(')'));
    let lef=interpet(left);
    let righ=interpet(right);
    lef=checkstring(lef);
    righ=checkstring(righ);
    checkWhile(lef,righ,entry, lines, condition,operator,linew);
    if(entry.body.body){mainfunc(entry.body.body,lines, condition);lines.push('}');}
    //else if here down
    else{
        //(entry.consequent.expression){ check if lior is smolani
        let a=[];
        a.push(entry.body);
        mainfunc(a, lines, condition);
    }
};
const checkstring=(str)=>{
    let ans = isNaN(str);
    if(str.includes('-(')){ans=false;}
    if(ans){
        str = '\''+str+'\'';
        return str;
    }
    else{return str;}
};
const checkWhile=(lef,righ,entry, lines, condition,operator,linew)=>{
    let c=lef+operator+righ;
    condition.push(c);
    let ans = eval(c);
    if(stop === 0&&!stopLines.includes(entry.loc.start.line)) {
        if (!ans || stop === 1) {
            lines.push(linew);
            updateBedLines(stopLines,entry.loc.start.line,entry.loc.end.line);
        }
        else {
            lines.push(linew);
            checkReturn1(entry);
        }
    }
    else{lines.push(linew);}
};

const StateRetrun=(entry,lines)=>{
    let s=StateRetrun1(entry);
    let linew=dok[entry.loc.start.line-1].substring(0,dok[entry.loc.start.line-1].indexOf('n')+1);
    lines.push(linew+' '+s+';');
};
const StateRetrun1=(entry)=>{
    if(entry.argument.type==='Identifier'){return getValue(TakeCareIden(entry.argument));}
    else if(entry.argument.type==='UnaryExpression'){return Exp_unary_solver(entry.argument.argument);}
    else if(entry.argument.type==='Literal'){return TakeCareLiteral(entry.argument);}
    else {return StateReturn2(entry);}
};
const StateReturn2=(entry)=>{
    if(entry.argument.type==='BinaryExpression'){return vdBinMemeber(entry.argument);}
    if(entry.argument.type==='MemberExpression'){return memberExpression_solver(entry.argument);}
};


const getName=(x)=>{
    if(x.type==='Identifier'){return TakeCareIden(x);}
    else {return TakeCareMemberC(x);}
};
const TakeCareLiteral=(entry)=>{return entry.value;};
const TakeCareIden=(entry)=>{return entry.name;};

const TextColor=(arr)=>{
    let str='';
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('@')){
            arr[i]=arr[i].substring(arr[i].indexOf('@')+1);
            arr[i]=arr[i].replace('<', ' < ');
            str=str+'<p style="background-color:green;">'+arr[i]+ '</p>';
            str=str+'\n';
        }
        else if(arr[i].includes('$')){
            arr[i]=arr[i].substring(arr[i].indexOf('$')+1);
            arr[i]=arr[i].replace('<', ' < ');
            str=str+'<p style="background-color:red;">'+arr[i]+' </p>';
            str=str+'\n';
        }
        else{str=TextColor1(arr,i,str);}
    }
    return str;
};
const TextColor1=(arr,i,str)=> {
    arr[i]=arr[i].replace('<', ' < ');
    str=str+'<p>'+arr[i]+' </p>';
    str=str+'\n';
    return str;
};

const VariableDecGlobal =(entry)=>{
    entry.declarations.forEach(function(element) {
        if((!(element.init))){VariableDec_let_global(element);}
        else if(element.init.type==='Literal'){VariableDec_literal_global(element);}
        else if(element.init.type==='Identifier'){variableDec_identifier_global(element);}
        else {VariableDecGlobal2(element);}
    });
};
const VariableDecGlobal2=(element)=>{
    if((element.init.type === 'BinaryExpression')) {variableDec_Binary_global(element);}
    else if(element.init.type==='UnaryExpression'){variableDec_Unary_global(element);}
    else if(element.init.type==='ArrayExpression'){variableDec_Array_global(element);}
    else if(element.init.type==='MemberExpression'){variableDec_MemberExpression(element);}
};
const VariableDec_let_global=(entry)=>{
    let n=entry.id.name;
    dictionary[n]=' ';
};
const VariableDec_literal_global=(entry)=>{
    let n = getName(entry.id);
    dictionary[n]=TakeCareLiteral(entry.init);
};
const variableDec_identifier_global=(entry)=>{
    let n = getName(entry.id);
    let k=TakeCareIden(entry.init);
    dictionary[n]=getValue_number(k);
};
const variableDec_Binary_global=(entry)=>{
    let n=getName(entry.id);
    dictionary[n]=vdBinMemeber(entry.init);
};
const variableDec_Unary_global=(entry)=>{
    let n = getName(entry.id);
    dictionary[n]=variable_dec_unarySolver(entry.init.argument);
};
const variableDec_Array_global=(element)=>{
    let n= getName(element.id);
    let v=dok[element.loc.start.line-1].substring(dok[element.loc.start.line-1].indexOf('=')+1);
    v=v.substring(0,v.indexOf(';')).trim();
    dictionary[n]=v;
    v=v.replace('[','');
    v=v.replace(']','');
    let arr=v.split(',');
    for(let i=0;i<arr.length;i++){
        dictionary[n+'['+i+']']=arr[i];
    }
};
const variableDec_MemberExpression=(entry)=>{
    let temp = entry.init.property;
    let res='';
    if(temp.type==='Literal'){
        res = temp.value;
    }
    else if(temp.type==='Identifier'){
        res = getValue_number(temp.name);
    }
    let n=entry.id.name;
    dictionary[n]=res;
};

const Expression_Global=(entry)=>{
    if(entry.expression.right.type==='Literal'){Expression_Global_literal(entry);}
    else if(entry.expression.right.type==='Identifier'){Expression_Global_identifier(entry);}
    else{Expression_Global2(entry);}
};
const Expression_Global2=(entry)=>{
    if(entry.expression.right.type==='MemberExpression'){Expression_Global_Member(entry);}
    else if(entry.expression.right.type==='BinaryExpression'){Expression_Global_binary(entry);}
    else if(entry.expression.right.type==='UnaryExpression'){Expression_Global_unary(entry);}
    else if(entry.expression.right.type==='ArrayExpression'){Expression_Global_Array(entry);}
};
const Expression_Global_literal=(entry)=>{
    let n=getName(entry.expression.left);
    dictionarySecondPlace[n]=TakeCareLiteral(entry.expression.right);
    if(dictionary.hasOwnProperty(n)){
        dictionary[n]=TakeCareLiteral(entry.expression.right);
    }
};
const Expression_Global_identifier=(entry)=>{
    let n=getName(entry.expression.left);
    let v=TakeCareIden(entry.expression.right);
    dictionarySecondPlace[n]=getValue_number(v);
    if(dictionary.hasOwnProperty(n)){
        dictionary[n]=getValue_number(v);
    }
};
const Expression_Global_Member =(entry)=>{
    let v=MemberExp2(entry.expression.right);
    let n=getName(entry.expression.left);
    dictionarySecondPlace[n]=getValue(v);
};
const Expression_Global_binary=(entry)=>{
    let n=getName(entry.expression.left);
    dictionary[n]=vdBinMemeber(entry.expression.right);
};
const Expression_Global_unary=(entry)=>{
    let n=getName(entry.expression.left);
    dictionarySecondPlace[n]=Exp_unary_solver(entry.expression.right.argument);
};
const Expression_Global_Array=(element)=>{
    let n= getName(element.expression.left);
    let v=dok[element.loc.start.line-1].substring(element.expression.right.loc.start.column,element.expression.right.loc.end.column);
    dictionary[n]=v;
    v=v.replace('[','');
    v=v.replace(']','');
    let arr=v.split(',');
    for(let i=0;i<arr.length;i++){
        dictionary[n+'['+i+']']=arr[i];
    }
};


const copyDIC=(old)=>{
    let had = {};
    for(var key in old){
        had[key]= old[key];
    }
    return had;
};
const vdBinMemeber=(entry)=>{
    let arr=[],arr1=[];
    let s='';
    binaryEXPsolve_helper(entry,arr);
    for(let i=0;i<arr.length;i=i+2) {
        if (arr[i].type === 'Literal') {
            arr1[i] = arr[i].value;
        }
        else {vdBinMemeber1(entry,arr,arr1,i);}
        s=s+arr1[i]+' ';
        if(!(i===arr.length-1))s=s+arr[i+1]+' ';
    }
    return s;
};
const vdBinMemeber1=(entry,arr,arr1,i)=>{
    if (arr[i].type === 'Identifier') {
        let z=arr[i].name;
        arr1[i] = getValue(z);
    }
    else if (arr[i].type === 'UnaryExpression') {
        arr1[i] = Exp_unary_solver(arr[i].argument);
    }
    else if (arr[i].type === 'MemberExpression') {
        arr1[i] = getValue(memberExpression_solver(arr[i]));
    }
    else if (arr[i].type === 'BinaryExpression') {
        arr1[i] = vdBinMemeber(arr[i]);
    }
};


const BigTakeCare=(x)=>{
    if(x.type==='Identifier'){
        let z = getValue(TakeCareIden(x));
        z=interpet(z);
        return calculateNum(z);
    }
    if(x.type==='Literal'){return TakeCareLiteral(x);}
    if(x.type==='BinaryExpression'){
        let temp=vdBinMemeber(x);
        temp=interpet(temp);
        let k=calculateNum(temp);
        return k;
    }
};

const calculateNum=(num)=>{
    let i=-10;
    let flagg=true;
    while(i<100000 && flagg){
        let str =num+'==='+i;
        if(eval(str)){flagg=false;}
        else{i++;}
    }
    return i;
};

const TakeCareMemberC=(entry)=>{
    let s=TakeCareIden(entry.object);
    s=s+'[';
    s=s+BigTakeCare(entry.property);
    s=s+']';
    return s;
};

const updateBedLines=(arr,start,end)=>{
    let i = start;
    while (i<end+1){
        arr.push(i);
        i++;
    }
};

export {parseCode};
export {parseCode1};
export {StartFunc};

