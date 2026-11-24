import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var r;var o;var s;var n=H(()=>{t();r=`shadowMapFragmentSoftTransparentShadow`,o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alpha) {discard;}
#endif
`;e.IncludesShadersStoreWGSL[r]||(e.IncludesShadersStoreWGSL[r]=o);s={name:r,shader:o}});export{s as n,n as t};