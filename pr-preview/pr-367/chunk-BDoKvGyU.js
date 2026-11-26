import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{n}from"./chunk-BMERetGG.js";import{n as n$1}from"./chunk-BI8AubQP.js";import{n as i}from"./chunk-CtC7CJPQ.js";var r;var t;var c;var u=H(()=>{t$1();n$1();n();i();r=`imageProcessingPixelShader`,t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result=vec4f(toLinearSpaceVec3(result.rgb),result.a);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
fragmentOutputs.color=result;}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);c={name:r,shader:t}});export{u as n,c as t};