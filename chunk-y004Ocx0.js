import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e$1}from"./chunk-B_VM99PE.js";import{n}from"./chunk-CzPlEBPv.js";import{t as f$1}from"./chunk-KjYhJDoM.js";import{n as s,t as l}from"./chunk-79RNsVD7.js";var i;var e;var f;var d=H(()=>{t();n();l();f$1();s();i=`hdrFilteringPixelShader`,e=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;uniform samplerCube inputTexture;uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);gl_FragColor=vec4(color*hdrScale,1.0);}`;e$1.ShadersStore[i]||(e$1.ShadersStore[i]=e);f={name:i,shader:e}});export{f as n,d as t};