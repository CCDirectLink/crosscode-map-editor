import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var r;var a;var c=H(()=>{t();r=`fogFragment`,a=`#ifdef FOG
var fog: f32=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color= vec4f(mix(uniforms.vFogColor,color.rgb,fog),color.a);
#endif
`;e.IncludesShadersStoreWGSL[r]||(e.IncludesShadersStoreWGSL[r]=a)});export{c as t};