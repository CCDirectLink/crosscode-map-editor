import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{t as a}from"./chunk-XVguvnM5.js";import{t as a$1}from"./chunk-CeHmLSL0.js";import{t as r$1}from"./chunk-BXEjaTo0.js";import{t as s$1}from"./chunk-Bgd-Gbir.js";var n;var r;var s;var c=H(()=>{t();r$1();a$1();a();s$1();n=`linePixelShader`,r=`#include<clipPlaneFragmentDeclaration>
uniform color: vec4f;
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStoreWGSL[n]||(e.ShadersStoreWGSL[n]=r);s={name:n,shader:r}});export{s as n,c as t};