import{a as H$1}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{t as n$1}from"./chunk-BgVyGedI.js";import{t as n$2}from"./chunk-BKRxOC0a.js";import{n as o,t as n$3}from"./chunk-DwovsIDl.js";import{t as T}from"./chunk-B2EIfOYf.js";import{t as l}from"./chunk-B0xzTqqg.js";import{t as d$1}from"./chunk-Bu-EGwTB.js";import{t as d$2}from"./chunk-K0KgA1OK.js";import{n as t$1}from"./chunk-Dk7H837M.js";import{n as f}from"./chunk-9eBNBfbZ.js";import{t as f$1}from"./chunk-JS9oXCYm.js";import{n as n$4}from"./chunk-DCihAtiR.js";import{t as i$1}from"./chunk-DF1D6Cez.js";var r;var E;var d=H$1(()=>{t();r=`pointCloudVertexDeclaration`,E=`#ifdef POINTSIZE
uniform float pointSize;
#endif
`;e.IncludesShadersStore[r]||(e.IncludesShadersStore[r]=E)});var i;var n;var H;var U=H$1(()=>{t();f$1();n$3();n$4();T();l();n$1();d();d$1();d$2();n$2();t$1();o();f();i$1();i=`depthVertexShader`,n=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;uniform vec2 depthValues;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;varying vec4 vViewPos;
#endif
#include<pointCloudVertexDeclaration>
varying float vDepthMetric;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#include<clipPlaneVertex>
gl_Position=viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vViewPos=view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
#else
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<pointCloudVertex>
}
`;e.ShadersStore[i]||(e.ShadersStore[i]=n);H={name:i,shader:n}});export{U as n,H as t};