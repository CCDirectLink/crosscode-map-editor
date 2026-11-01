import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e$1}from"./chunk-B_VM99PE.js";import{n}from"./chunk-CzPlEBPv.js";var e;var o;var h;var i=H(()=>{t();n();e=`extractHighlightsPixelShader`,o=`#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}`;e$1.ShadersStore[e]||(e$1.ShadersStore[e]=o);h={name:e,shader:o}});export{i as n,h as t};