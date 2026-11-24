import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e$1}from"./chunk-B_VM99PE.js";var e;var s;var n=H(()=>{t();e=`logDepthVertex`,s=`#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`;e$1.IncludesShadersStoreWGSL[e]||(e$1.IncludesShadersStoreWGSL[e]=s)});export{n as t};