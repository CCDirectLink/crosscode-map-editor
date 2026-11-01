import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var r;var o;var n;var d=H(()=>{t();r=`shadowMapFragmentSoftTransparentShadow`,o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alpha) discard;
#endif
`;e.IncludesShadersStore[r]||(e.IncludesShadersStore[r]=o);n={name:r,shader:o}});export{n,d as t};