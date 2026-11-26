import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var i;var r;var S;var n=H(()=>{t();i=`pickingPixelShader`,r=`#if defined(INSTANCES)
varying vec4 vMeshID;
#else
uniform vec4 meshID;
#endif
void main(void) {
#if defined(INSTANCES)
gl_FragColor=vMeshID;
#else
gl_FragColor=meshID;
#endif
}`;e.ShadersStore[i]||(e.ShadersStore[i]=r);S={name:i,shader:r}});export{n,S as t};