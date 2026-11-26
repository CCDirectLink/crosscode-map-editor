import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as n$1}from"./chunk-BKRxOC0a.js";import{n as o,t as n$2}from"./chunk-DwovsIDl.js";import{t as T}from"./chunk-B2EIfOYf.js";import{t as l$1}from"./chunk-B0xzTqqg.js";import{t as d$1}from"./chunk-Bu-EGwTB.js";import{t as d$2}from"./chunk-K0KgA1OK.js";import{n as t$2}from"./chunk-Dk7H837M.js";import{n as f$1}from"./chunk-9eBNBfbZ.js";import{t as f$2}from"./chunk-JS9oXCYm.js";import{n as n$3}from"./chunk-DCihAtiR.js";import{t as a$1}from"./chunk-BuE22lA6.js";import{t as i$1}from"./chunk-C7-Cw1Ov.js";import{n as n$4}from"./chunk-CzPlEBPv.js";import{t as i$2}from"./chunk-Bm35bAXl.js";import{t as d$3}from"./chunk-NFzvIIDQ.js";var i;var E;var a=H(()=>{t$1();i=`meshVertexDeclaration`,E=`uniform mat4 world;uniform float visibility;
`;e.IncludesShadersStore[i]||(e.IncludesShadersStore[i]=E)});var d;var L;var n=H(()=>{t$1();i$2();a();d=`shadowMapVertexDeclaration`,L=`#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`;e.IncludesShadersStore[d]||(e.IncludesShadersStore[d]=L)});var l;var P;var c=H(()=>{t$1();i$1();a$1();l=`shadowMapUboDeclaration`,P=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;e.IncludesShadersStore[l]||(e.IncludesShadersStore[l]=P)});var s;var _;var m=H(()=>{t$1();s=`shadowMapVertexExtraDeclaration`,_=`#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;e.IncludesShadersStore[s]||(e.IncludesShadersStore[s]=_)});var S;var y;var f=H(()=>{t$1();S=`shadowMapVertexNormalBias`,y=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`;e.IncludesShadersStore[S]||(e.IncludesShadersStore[S]=y)});var t;var p;var Me;var O=H(()=>{t$1();f$2();n$2();n$3();T();n$4();n();c();m();l$1();d$1();d$2();n$1();t$2();o();f();d$3();f$1();t=`shadowMapVertexShader`,p=`attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`;e.ShadersStore[t]||(e.ShadersStore[t]=p);Me={name:t,shader:p}});export{O as n,Me as t};