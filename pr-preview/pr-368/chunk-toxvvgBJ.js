import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as a$1}from"./chunk-DjiCho4_.js";import{t as n$1}from"./chunk-QUeeeb96.js";import{n as t$2}from"./chunk-uif5YYPe.js";import{n as s}from"./chunk-CkAcR2in.js";import{t as a$2}from"./chunk-C8k4sfZh.js";import{n as t$3}from"./chunk-DRY21oHU.js";var i;var p;var n=H(()=>{t$1();a$1();a$2();i=`gaussianSplattingFragmentDeclaration`,p=`vec4 gaussianColor(vec4 inColor)
{float A=-dot(vPosition,vPosition);if (A<-4.0) discard;float B=exp(A)*inColor.a;
#include<logDepthFragment>
vec3 color=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4(color,B);}
`;e.IncludesShadersStore[i]||(e.IncludesShadersStore[i]=p)});var a;var t;var y;var S=H(()=>{t$1();t$2();n$1();t$3();n();s();a=`gaussianSplattingPixelShader`,t=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vec4 vColor;varying vec2 vPosition;
#include<gaussianSplattingFragmentDeclaration>
void main () { 
#include<clipPlaneFragment>
gl_FragColor=gaussianColor(vColor);}
`;e.ShadersStore[a]||(e.ShadersStore[a]=t);y={name:a,shader:t}});export{y as n,S as t};