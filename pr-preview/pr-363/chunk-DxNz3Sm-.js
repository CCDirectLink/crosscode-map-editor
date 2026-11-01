import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{n}from"./chunk-CzPlEBPv.js";var r;var o;var l;var i=H(()=>{t();n();r=`rgbdEncodePixelShader`,o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;e.ShadersStore[r]||(e.ShadersStore[r]=o);l={name:r,shader:o}});export{l as n,i as t};