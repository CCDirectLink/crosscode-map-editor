import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e$1}from"./chunk-B_VM99PE.js";import{n}from"./chunk-BMERetGG.js";import{t as n$1}from"./chunk-B7s5krO3.js";import{n as n$2,t as c}from"./chunk-DH-80Hy5.js";var e;var i;var S;var p=H(()=>{t();n();n$2();n$1();c();e=`hdrFilteringPixelShader`,i=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform alphaG: f32;var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=radiance(uniforms.alphaG,inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;e$1.ShadersStoreWGSL[e]||(e$1.ShadersStoreWGSL[e]=i);S={name:e,shader:i}});export{p as n,S as t};