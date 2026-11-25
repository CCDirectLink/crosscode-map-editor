import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{n as n$1}from"./chunk-BMERetGG.js";var r;var t;var u;var n=H(()=>{t$1();n$1();r=`rgbdDecodePixelShader`,t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);u={name:r,shader:t}});export{u as n,n as t};