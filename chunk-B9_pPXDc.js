import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var r;var n;var i;var S=H(()=>{t();r=`boundingBoxRendererPixelShader`,n=`uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=n);i={name:r,shader:n}});export{i as n,S as t};