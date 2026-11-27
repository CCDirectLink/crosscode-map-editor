import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e$1}from"./chunk-B_VM99PE.js";var e;var n;var c;var i=H(()=>{t();e=`fluidRenderingParticleThicknessPixelShader`,n=`uniform particleAlpha: f32;varying uv: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
var thickness: f32=sqrt(1.0-r2);fragmentOutputs.color=vec4f(vec3f(uniforms.particleAlpha*thickness),1.0);}
`;e$1.ShadersStoreWGSL[e]||(e$1.ShadersStoreWGSL[e]=n);c={name:e,shader:n}});export{i as n,c as t};