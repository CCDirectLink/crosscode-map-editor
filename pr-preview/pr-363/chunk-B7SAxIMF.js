import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{n}from"./chunk-BMERetGG.js";var r;var t;var u;var m=H(()=>{t$1();n();r=`rgbdEncodePixelShader`,t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);u={name:r,shader:t}});export{u as n,m as t};