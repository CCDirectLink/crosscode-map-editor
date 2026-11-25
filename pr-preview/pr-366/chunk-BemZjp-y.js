import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as t$2}from"./chunk-CDkt_Tuu.js";var d;var S;var i=H(()=>{t$1();d=`boundingBoxRendererFragmentDeclaration`,S=`uniform vec4 color;
`;e.IncludesShadersStore[d]||(e.IncludesShadersStore[d]=S)});var r;var t;var h;var c=H(()=>{t$1();i();t$2();r=`boundingBoxRendererPixelShader`,t=`#include<__decl__boundingBoxRendererFragment>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStore[r]||(e.ShadersStore[r]=t);h={name:r,shader:t}});export{h as n,c as t};