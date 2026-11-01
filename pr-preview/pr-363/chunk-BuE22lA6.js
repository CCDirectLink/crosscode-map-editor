import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e$1}from"./chunk-B_VM99PE.js";var e;var t;var a=H(()=>{t$1();e=`meshUboDeclaration`,t=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;e$1.IncludesShadersStore[e]||(e$1.IncludesShadersStore[e]=t)});export{a as t};