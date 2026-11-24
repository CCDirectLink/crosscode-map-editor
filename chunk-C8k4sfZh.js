import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e$1}from"./chunk-B_VM99PE.js";var e;var t;var a=H(()=>{t$1();e=`fogFragment`,t=`#ifdef FOG
float fog=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color.rgb=mix(vFogColor,color.rgb,fog);
#endif
`;e$1.IncludesShadersStore[e]||(e$1.IncludesShadersStore[e]=t)});export{a as t};