import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";var r;var a;var t;var i=H(()=>{t$1();r=`displayPassPixelShader`,a=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D passSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(passSampler,vUV);}`;e.ShadersStore[r]||(e.ShadersStore[r]=a);t={name:r,shader:a}});export{t as n,i as t};