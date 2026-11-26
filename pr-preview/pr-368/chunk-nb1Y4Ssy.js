import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{n}from"./chunk-CzPlEBPv.js";var r;var o;var m;var i=H(()=>{t();n();r=`rgbdDecodePixelShader`,o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;e.ShadersStore[r]||(e.ShadersStore[r]=o);m={name:r,shader:o}});export{m as n,i as t};