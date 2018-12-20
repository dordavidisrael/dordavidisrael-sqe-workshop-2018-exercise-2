import $ from 'jquery';
import {parseCode,parseCode1,StartFunc} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let argToParse = $('#codePlaceholder1').val();
        let parsedArg = parseCode1(argToParse);
        let parsedCode = parseCode(codeToParse);
        let s= StartFunc(parsedCode,parsedArg);
        let x = document.getElementById('ta').rows[1].cells;
        x[1].innerHTML=s;
    });
});

/*const TextColor=(arr)=>{
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
        else{
            arr[i]=arr[i].replace('<', ' < ');
            str=str+'<p>'+arr[i]+' </p>';
            str=str+'\n';
        }
    }
    return str;
};
*/