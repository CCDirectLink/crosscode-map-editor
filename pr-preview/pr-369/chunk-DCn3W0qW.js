import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var n;var r;var o;var s=H(()=>{t();n=`pickingPixelShader`,r=`#if defined(INSTANCES)
varying vMeshID: vec4f;
#else
uniform meshID: vec4f;
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#if defined(INSTANCES)
fragmentOutputs.color=input.vMeshID;
#else
fragmentOutputs.color=uniforms.meshID;
#endif
}`;e.ShadersStoreWGSL[n]||(e.ShadersStoreWGSL[n]=r);o={name:n,shader:r}});export{s as n,o as t};