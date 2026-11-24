// Tiny stack VM, make.fun tiny-stack-vm-01 ISA: run each /input/<id>/program.bin on its input.bin, write /output/<id>/stdout.bin + exit.txt.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const O=[0,1,2,3,4,5,6,7,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,32,33,34,48,49,50,51,52,64,65,80,81,82,83],M="000101401010012022023033021021021021021021021011021021021011021021021021021021200210210200000011020010010001010",I=[],P=[],S=[],V=[];
O.forEach((o,k)=>{I[o]=+M[3*k];P[o]=+M[3*k+1];S[o]=+M[3*k+2];V[o]=1});
function run(p,q){
const D=new Int32Array(256),C=new Int32Array(64),E=new Int32Array(256),U=new Uint8Array(65536),n=p.length;
let s=0,c=0,l=0,g=0,t=0,pc=0;
const d=e=>({o:U.slice(0,l),e});
for(;;){
if(t>999999)return d(10);
if(pc<0||pc>=n)return d(9);
const a=p[pc];
if(!V[a])return d(5);
const m=I[a];
if(pc+m>=n)return d(9);
t++;
const x=pc+1+m;
if(s<P[a])return d(2);
if(s-P[a]+S[a]>256)return d(3);
pc=x;
switch(a){
case 0:return d(0);
case 1:D[s++]=(p[x-1]<<24)>>24;break;
case 2:D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
case 3:s--;break;
case 4:D[s]=D[s-1];s++;break;
case 5:[D[s-2],D[s-1]]=[D[s-1],D[s-2]];break;
case 6:D[s]=D[s-2];s++;break;
case 7:[D[s-3],D[s-2],D[s-1]]=[D[s-2],D[s-1],D[s-3]];break;
case 23:D[s-1]=-D[s-1];break;
case 27:D[s-1]=~D[s-1];break;
case 48:case 49:case 50:{const r=((p[x-2]|p[x-1]<<8)<<16)>>16;let k=1;if(a>48){const v=D[--s];k=(a<50)===(v===0);}if(k)pc=x+r;break;}
case 51:if(c>63)return d(7);C[c++]=x;pc=p[x-2]|p[x-1]<<8;break;
case 52:if(!c)return d(8);pc=C[--c];break;
case 64:{const v=D[s-1];if(v<0||v>255)return d(6);D[s-1]=E[v];break;}
case 65:{const v=D[s-1],w=D[s-2];if(v<0||v>255)return d(6);s-=2;E[v]=w;break;}
case 80:{const w=''+D[--s];if(l+w.length>65536)return d(11);for(let i=0;w[i];i++)U[l++]=w.charCodeAt(i);break;}
case 81:if(l>65535)return d(11);U[l++]=D[--s]&255;break;
case 82:D[s++]=g<q.length?q[g++]:-1;break;
case 83:return d(D[--s]&255);
default:{const b=D[s-1],y=D[s-2];let r;
if(a===16)r=y+b;
else if(a===17)r=y-b;
else if(a===18)r=Math.imul(y,b);
else if(a===19){if(!b)return d(4);r=(y/b)|0;}
else if(a===20){if(!b)return d(4);r=(y%b)|0;}
else if(a===21){if(!b)return d(4);r=(y>>>0)/(b>>>0)|0;}
else if(a===22){if(!b)return d(4);r=(y>>>0)%(b>>>0)|0;}
else if(a===24)r=y&b;
else if(a===25)r=y|b;
else if(a===26)r=y^b;
else if(a===28)r=y<<(b&31);
else if(a===29)r=y>>(b&31);
else if(a===30)r=y>>>(b&31);
else if(a===32)r=y===b?1:0;
else if(a===33)r=y<b?1:0;
else r=(y>>>0)<(b>>>0)?1:0;
s-=2;D[s++]=r;}
}
}
}
const A=process.env.MAKEFUN_INPUT_DIR??'/input',B=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(A).sort()){
const r=run(new Uint8Array(readFileSync(join(A,id,'program.bin'))),new Uint8Array(readFileSync(join(A,id,'input.bin'))));
mkdirSync(join(B,id),{recursive:true});
writeFileSync(join(B,id,'stdout.bin'),r.o);
writeFileSync(join(B,id,'exit.txt'),r.e+'\n');
}
