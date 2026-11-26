import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e$1}from"./chunk-B_VM99PE.js";var e;var i;var t=H(()=>{t$1();e=`boundingBoxRendererUboDeclaration`,i=`#ifdef WEBGL2
uniform vec4 color;uniform mat4 world;uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#else
layout(std140,column_major) uniform;uniform BoundingBoxRenderer {vec4 color;mat4 world;mat4 viewProjection;mat4 viewProjectionR;};
#endif
`;e$1.IncludesShadersStore[e]||(e$1.IncludesShadersStore[e]=i)});export{t};