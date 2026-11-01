import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e$1}from"./chunk-B_VM99PE.js";var e;var a;var o;var t=H(()=>{t$1();e=`fluidRenderingParticleDiffusePixelShader`,a=`uniform particleAlpha: f32;varying uv: vec2f;varying diffuseColor: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
fragmentOutputs.color=vec4f(input.diffuseColor,1.0);}
`;e$1.ShadersStoreWGSL[e]||(e$1.ShadersStoreWGSL[e]=a);o={name:e,shader:a}});export{t as n,o as t};