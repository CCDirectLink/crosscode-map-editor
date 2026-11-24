import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{n}from"./chunk-CzPlEBPv.js";import{n as f}from"./chunk-TJCmu4Ri.js";import{t as i$1}from"./chunk-7zCtH7-w.js";var r;var i;var m;var l=H(()=>{t();f();n();i$1();r=`imageProcessingPixelShader`,i=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;}`;e.ShadersStore[r]||(e.ShadersStore[r]=i);m={name:r,shader:i}});export{m as n,l as t};