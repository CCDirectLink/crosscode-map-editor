import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as a$1}from"./chunk-XVguvnM5.js";import{t as a$2}from"./chunk-CeHmLSL0.js";import{t as r}from"./chunk-BXEjaTo0.js";import{t as s}from"./chunk-Bgd-Gbir.js";import{t as c}from"./chunk-jXBOd57c.js";import{n as s$1}from"./chunk-DaXpgHuN.js";var o;var u;var i=H(()=>{t$1();a$1();c();o=`gaussianSplattingFragmentDeclaration`,u=`fn gaussianColor(inColor: vec4f,inPosition: vec2f)->vec4f
{var A : f32=-dot(inPosition,inPosition);if (A>-4.0)
{var B: f32=exp(A)*inColor.a;
#include<logDepthFragment>
var color: vec3f=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4f(color,B);} else {return vec4f(0.0);}}
`;e.IncludesShadersStoreWGSL[o]||(e.IncludesShadersStoreWGSL[o]=u)});var t;var a;var W;var S=H(()=>{t$1();r();a$2();s$1();i();s();t=`gaussianSplattingPixelShader`,a=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vColor: vec4f;varying vPosition: vec2f;
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
fragmentOutputs.color=gaussianColor(input.vColor,input.vPosition);}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=a);W={name:t,shader:a}});export{W as n,S as t};