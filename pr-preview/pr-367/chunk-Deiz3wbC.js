import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";var o;var t;var f;var n=H(()=>{t$1();o=`oitFinalPixelShader`,t=`var uFrontColor: texture_2d<f32>;var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);var backColor: vec4f=textureLoad(uBackColor,fragCoord,0);var alphaMultiplier: f32=1.0-frontColor.a;fragmentOutputs.color=vec4f(
frontColor.rgb+alphaMultiplier*backColor.rgb,
frontColor.a+backColor.a
);}
`;e.ShadersStoreWGSL[o]||(e.ShadersStoreWGSL[o]=t);f={name:o,shader:t}});export{n,f as t};