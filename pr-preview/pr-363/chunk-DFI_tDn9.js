import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as n$1}from"./chunk-QUeeeb96.js";import{t as s}from"./chunk-ChmJYBSf.js";import{t as n$2}from"./chunk-BgVyGedI.js";import{t as n$3}from"./chunk-BKRxOC0a.js";import{t as l}from"./chunk-B0xzTqqg.js";import{n as f}from"./chunk-9eBNBfbZ.js";import{t as a$1}from"./chunk-BuE22lA6.js";import{t as i}from"./chunk-C7-Cw1Ov.js";var t;var x;var n=H(()=>{t$1();t=`lineVertexDeclaration`,x=`uniform mat4 viewProjection;
#define ADDITIONAL_VERTEX_DECLARATION
`;e.IncludesShadersStore[t]||(e.IncludesShadersStore[t]=x)});var c;var u;var a=H(()=>{t$1();i();a$1();c=`lineUboDeclaration`,u=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;e.IncludesShadersStore[c]||(e.IncludesShadersStore[c]=u)});var r;var d;var O;var w=H(()=>{t$1();n();a();n$2();l();n$1();n$3();f();s();r=`lineVertexShader`,d=`#include<__decl__lineVertex>
#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;attribute vec4 normal;uniform float width;uniform float aspectRatio;
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
mat4 worldViewProjection=viewProjection*finalWorld;vec4 viewPosition=worldViewProjection*vec4(position,1.0);vec4 viewPositionNext=worldViewProjection*vec4(normal.xyz,1.0);vec2 currentScreen=viewPosition.xy/viewPosition.w;vec2 nextScreen=viewPositionNext.xy/viewPositionNext.w;currentScreen.x*=aspectRatio;nextScreen.x*=aspectRatio;vec2 dir=normalize(nextScreen-currentScreen);vec2 normalDir=vec2(-dir.y,dir.x);normalDir*=width/2.0;normalDir.x/=aspectRatio;vec4 offset=vec4(normalDir*normal.w,0.0,0.0);gl_Position=viewPosition+offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
vec4 worldPos=finalWorld*vec4(position,1.0);
#include<clipPlaneVertex>
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[r]||(e.ShadersStore[r]=d);O={name:r,shader:d}});export{w as n,O as t};