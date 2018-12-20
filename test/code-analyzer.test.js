import assert from 'assert';
import {parseCode,parseCode1,StartFunc} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('1 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                '}\n')),
            '<p>function b(){ </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('1.1 test', () => {
        assert.equal(
            StartFunc(parseCode('let z=1;')),
            '<p>let z=1; </p>\n'
        );
    });
    it('1.2 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=8;\n' +
                'z=1;\n' +
                'y=2;\n' +
                'function b(){\n' +
                '}')),
            '<p>let x=8; </p>\n' +
            '<p>z=1; </p>\n' +
            '<p>y=2; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('2 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=1;\n' +
                'let y=2;\n' +
                'function b(){\n' +
                '\n' +
                'if(x>100){\n' +
                '}\n' +
                'else{\n' +
                'return 12;\n' +
                '}\n' +
                '\n' +
                '}')),
            '<p>let x=1; </p>\n' +
            '<p>let y=2; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p style="background-color:red;">if(x>100){ </p>\n' +
            '<p>} </p>\n' +
            '<p>else </p>\n' +
            '<p>{ </p>\n' +
            '<p>return 12; </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('3 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=1;\n' +
                'let y=2;\n' +
                'function b(){\n' +
                'let z = 8;\n' +
                'let k=2;\n' +
                'k=3;\n' +
                'return x;\n' +
                'return k;\n' +
                'return z;\n' +
                '}')),
            '<p>let x=1; </p>\n' +
            '<p>let y=2; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>return x; </p>\n' +
            '<p>return 3; </p>\n' +
            '<p>return 8; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('4 test', () => {
        assert.equal(
            StartFunc(parseCode('let arr = [1,2,3];\n' +
                'let x;\n' +
                'let y=8;\n' +
                'let xr=8;\n' +
                'let x=-1;\n' +
                'let x = y+xr;\n' +
                'let p = arr[0];\n' +
                'function b(){\n' +
                'arr[0]=1;\n' +
                '}\n' +
                '\n')),
            '<p>let arr = [1,2,3]; </p>\n' +
            '<p>let x; </p>\n' +
            '<p>let y=8; </p>\n' +
            '<p>let xr=8; </p>\n' +
            '<p>let x=-1; </p>\n' +
            '<p>let x = y+xr; </p>\n' +
            '<p>let p = arr[0]; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>arr[0]=1; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('5 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=1;\n' +
                'let y=2;\n' +
                'function b(){\n' +
                'let z = 8;\n' +
                'let k=2;\n' +
                'k=3;\n' +
                'return x+y+z+k;\n' +
                '}')),
            '<p>let x=1; </p>\n' +
            '<p>let y=2; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>return x + y + 8 + 3 ; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('6 test', () => {
        assert.equal(
            StartFunc(parseCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                ' else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                '}\n'),parseCode1('1,2,3 ')),
            '<p>function foo(x, y, z){ </p>\n' +
            '<p style="background-color:red;">    if (x + 1  + y  < z) { </p>\n' +
            '<p>        return x + y + z + 0 + 5  ; </p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:green;"> else if (x + 1  + y  < z * 2 ) {</p>\n' +
            '<p>        return x + y + z + 0 + x + 5  ; </p>\n' +
            '<p>} </p>\n' +
            '<p>else </p>\n' +
            '<p>{ </p>\n' +
            '<p>        return x + y + z + 0 + z + 5  ; </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('7 test', () => {
        assert.equal(
            StartFunc(parseCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}'),parseCode1('1,2,3 ')),
            '<p>function foo(x, y, z){ </p>\n' +
            '<p>    while (x + 1  < z) { </p>\n' +
            '<p>        z=x + 1  + x + 1  + y   * 2 ; </p>\n' +
            '<p>} </p>\n' +
            '<p>    return z; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('8 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=1;\n' +
                'let a=x;\n' +
                'let aa = (1+2+3);\n' +
                'let aaa = (1+2)+(1+2);\n' +
                'let arr = [1,2,3];\n' +
                'let xr = arr[0];\n' +
                'let xrr = -1+2+3;\n' +
                'function b(){\n' +
                '}')),
            '<p>let x=1; </p>\n' +
            '<p>let a=x; </p>\n' +
            '<p>let aa = (1+2+3); </p>\n' +
            '<p>let aaa = (1+2)+(1+2); </p>\n' +
            '<p>let arr = [1,2,3]; </p>\n' +
            '<p>let xr = arr[0]; </p>\n' +
            '<p>let xrr = -1+2+3; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('9 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(x){\n' +
                'return x[0];\n' +
                '}'),parseCode1('[1,2,3] ')),
            '<p>function b(x){ </p>\n' +
            '<p>return x[0]; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('10 test', () => {
        assert.equal(
            StartFunc(parseCode('let z=1;\n' +
                'let arr = [1,2,3];\n' +
                'z=8;\n' +
                'let x=z;\n' +
                'z=arr[0];\n' +
                'z=1+2+3;\n' +
                'z=-1;\n' +
                'arr=[1,2,3,4];\n' +
                'z=arr[0]+arr[1];\n' +
                'function b(){\n' +
                'let x=1;\n' +
                'x=8;\n' +
                'return z;\n' +
                '}')),
            '<p>let z=1; </p>\n' +
            '<p>let arr = [1,2,3]; </p>\n' +
            '<p>z=8; </p>\n' +
            '<p>let x=z; </p>\n' +
            '<p>z=arr[0]; </p>\n' +
            '<p>z=1+2+3; </p>\n' +
            '<p>z=-1; </p>\n' +
            '<p>arr=[1,2,3,4]; </p>\n' +
            '<p>z=arr[0]+arr[1]; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>x=8; </p>\n' +
            '<p>return z; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('11 test', () => {
        assert.equal(
            StartFunc(parseCode('let z=1;\n' +
                'let arr = [1,2,3];\n' +
                'z=8;\n' +
                'let x=z;\n' +
                'z=arr[0];\n' +
                'z=1+2+3;\n' +
                'z=-1;\n' +
                'arr=[1,2,3,4];\n' +
                'z=arr[0]+arr[1];\n' +
                'function b(){\n' +
                'let x=1;\n' +
                'x=8;\n' +
                'return z;\n' +
                '}')),
            '<p>let z=1; </p>\n' +
            '<p>let arr = [1,2,3]; </p>\n' +
            '<p>z=8; </p>\n' +
            '<p>let x=z; </p>\n' +
            '<p>z=arr[0]; </p>\n' +
            '<p>z=1+2+3; </p>\n' +
            '<p>z=-1; </p>\n' +
            '<p>arr=[1,2,3,4]; </p>\n' +
            '<p>z=arr[0]+arr[1]; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>x=8; </p>\n' +
            '<p>return z; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('12 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                '\n' +
                'let x;\n' +
                'let arr = [1,2,3];\n' +
                'let z=8;\n' +
                'let p = z;\n' +
                'let px = -1;\n' +
                'let pzz = 1+2+3;\n' +
                'let pizi = arr[0];\n' +
                'let pizi2 = arr[0]+arr[1];\n' +
                'let higu = (1+2)+(1+2);\n' +
                'let zoro = -z;\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('13 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                'if (10>1)\n' +
                'return 12;\n' +
                '\n' +
                'while (10>1)\n' +
                'return 2;\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p style="background-color:green;">if (10>1)</p>\n' +
            '<p>return 12; </p>\n' +
            '<p>while (10>1) </p>\n' +
            '<p>return 2; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('14 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                'let x=1;\n' +
                'x=-1;\n' +
                'x=[1,2,3];\n' +
                'let y;\n' +
                'let z=1;\n' +
                'y=z;\n' +
                'y=x[0];\n' +
                'let k;\n' +
                'k=x[z];\n' +
                'k=-(1+2);\n' +
                'kk=-x[0];\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('15 test', () => {
        assert.equal(
            StartFunc(parseCode('let z=1;\n' +
                'let x;\n' +
                'let xx;\n' +
                'let xxx;\n' +
                'let xxxx;\n' +
                'x=z;\n' +
                'function b(x,y,z=1){ \n' +
                'let x=-1+2;\n' +
                'let z = -(1+2);\n' +
                'let arr = [1,2,3];\n' +
                'let kp = -arr[0];\n' +
                'let p =0;\n' +
                'let pp= arr[p];\n' +
                'x=p;\n' +
                'x=arr[0];\n' +
                'let n=9;\n' +
                'x=-1+2;\n' +
                'xx=1+2+(1+2);\n' +
                'xxx=arr[0]+arr[1];\n' +
                'z=-8;\n' +
                'k=-n;\n' +
                'z=[1,2,3];\n' +
                '}\n'),parseCode1('1,2,3  ')),
            '<p>let z=1; </p>\n' +
            '<p>let x; </p>\n' +
            '<p>let xx; </p>\n' +
            '<p>let xxx; </p>\n' +
            '<p>let xxxx; </p>\n' +
            '<p>x=z; </p>\n' +
            '<p>function b(x,y,z=1){  </p>\n' +
            '<p>x=p; </p>\n' +
            '<p>x=arr[0]; </p>\n' +
            '<p>x=- ( 1 )  + 2 ; </p>\n' +
            '<p>xx=1 + 2 + 1 + 2  ; </p>\n' +
            '<p>xxx= 1 + 2 ; </p>\n' +
            '<p>z=- ( 8 ) ; </p>\n' +
            '<p>z=1,2,3; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('16 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                '\n' +
                'let x=10;\n' +
                'if(x>0){\n' +
                '}\n' +
                '\n' +
                'if(x>20){\n' +
                'if(x>0){\n' +
                '}\n' +
                '}\n' +
                '\n' +
                '\n' +
                'if(x>0){\n' +
                '}\n' +
                '\n' +
                'else if (x>2){\n' +
                '}\n' +
                '\n' +
                'else if (x>4){\n' +
                '}\n' +
                '\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p style="background-color:green;">if(10>0){</p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:red;">if(10>20){ </p>\n' +
            '<p>if(10>0){ </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:green;">if(10>0){</p>\n' +
            '<p>} </p>\n' +
            '<p>else if (10>2){ </p>\n' +
            '<p>} </p>\n' +
            '<p>else if (10>4){ </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('17 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                '\n' +
                'if(1>10){\n' +
                '\n' +
                '}\n' +
                '\n' +
                'else\n' +
                'return 1;\n' +
                '\n' +
                'if(1<0){\n' +
                '\n' +
                '}\n' +
                '\n' +
                'else if(2<1){\n' +
                '\n' +
                '}\n' +
                '\n' +
                'else if(22>3){\n' +
                '\n' +
                '}\n' +
                '\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p style="background-color:red;">if(1>10){ </p>\n' +
            '<p>} </p>\n' +
            '<p>else </p>\n' +
            '<p>return 1; </p>\n' +
            '<p style="background-color:red;">if(1 < 0){ </p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:red;">else if(2 < 1){ </p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:green;">else if(22>3){</p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('18 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                'if(1<0){\n' +
                '}\n' +
                'else if(2<4)\n' +
                'return 11;\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p style="background-color:red;">if(1 < 0){ </p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:green;">else if(2 < 4)</p>\n' +
            '<p>return 11; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('19 test', () => {
        assert.equal(
            StartFunc(parseCode('let arr =[1,2,3]; \n' +
                'function b(){ \n' +
                'if(arr[0]<2){ \n' +
                '\n' +
                '} \n' +
                'if(arr[0]>-1){ \n' +
                '} \n' +
                'while (10>0) \n' +
                'return 7; \n' +
                '}\n' +
                '\n')),
            '<p>let arr =[1,2,3];  </p>\n' +
            '<p>function b(){  </p>\n' +
            '<p style="background-color:green;">if(arr[0] < 2){ </p>\n' +
            '<p>} </p>\n' +
            '<p style="background-color:green;">if(arr[0]>- ( 1 ) ){ </p>\n' +
            '<p>} </p>\n' +
            '<p>while (10>0)  </p>\n' +
            '<p>return 7; </p>\n' +
            '<p>} </p>\n'

        );
    });
    it('20 test', () => {
        assert.equal(
            StartFunc(parseCode('let arr = [1,2,3];\n' +
                'let x=0;\n' +
                'let z = arr[x];\n' +
                '\n' +
                'function b(){\n' +
                '\n' +
                'return -1;\n' +
                '\n' +
                '}\n')),
            '<p>let arr = [1,2,3]; </p>\n' +
            '<p>let x=0; </p>\n' +
            '<p>let z = arr[x]; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>return - ( 1 ) ; </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('21 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                'while (1>100){\n' +
                'let x=1;\n' +
                '}\n' +
                '}\n')),
            '<p>function b(){ </p>\n' +
            '<p>while (1>100){ </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('22 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=1;\n' +
                'function b(){\n' +
                'x=2;\n' +
                'if(2>1){\n' +
                'x=3;\n' +
                '}\n' +
                '}')),
            '<p>let x=1; </p>\n' +
            '<p>function b(){ </p>\n' +
            '<p>x=2; </p>\n' +
            '<p style="background-color:green;">if(2>1){</p>\n' +
            '<p>x=3; </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('23 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(x,y){\n' +
                'while(1>0){\n' +
                'if(1>0){\n' +
                '}\n' +
                'else if(1>0){\n' +
                '}\n' +
                'let x=1;\n' +
                'return 121;\n' +
                '}\n' +
                '}'),parseCode1('-1,\n' +
                '1+2')),
            '<p>function b(x,y){ </p>\n' +
            '<p>while(1>0){ </p>\n' +
            '<p style="background-color:green;">if(1>0){</p>\n' +
            '<p>} </p>\n' +
            '<p>else if(1>0){ </p>\n' +
            '<p>} </p>\n' +
            '<p>return 121; </p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('24 test', () => {
        assert.equal(
            StartFunc(parseCode('let x=10;\n' +
                'let y=20;\n' +
                'let z=30;\n' +
                'let w=40;\n' +
                'function b(){\n' +
                'x=8;\n' +
                'z=x+1;\n' +
                '}')),
            '<p>let x=10; </p>\n' +
                '<p>let y=20; </p>\n' +
                '<p>let z=30; </p>\n' +
                '<p>let w=40; </p>\n' +
                '<p>function b(){ </p>\n' +
                '<p>x=8; </p>\n' +
                '<p>z=x + 1 ; </p>\n' +
                '<p>} </p>\n'
        );
    });
    it('24 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                '\n' +
                'let arr=[1,2,3];\n' +
                'let a=0;\n' +
                'let b=1;\n' +
                '\n' +
                'arr[a+b]=18;\n' +
                '\n' +
                'if(arr[1]>17){}\n' +
                '\n' +
                '\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p style="background-color:green;">if(18>17){}</p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });
    it('24 test', () => {
        assert.equal(
            StartFunc(parseCode('function b(){\n' +
                '\n' +
                'let arr=[1,2,3];\n' +
                'let a=0;\n' +
                'let b=1;\n' +
                'arr[b]=4;\n' +
                'arr[a+b]=18;\n' +
                '\n' +
                'if(arr[1+0]>17){}\n' +
                '\n' +
                '\n' +
                '}')),
            '<p>function b(){ </p>\n' +
            '<p style="background-color:green;">if(18>17){}</p>\n' +
            '<p>} </p>\n' +
            '<p>} </p>\n'
        );
    });

});
