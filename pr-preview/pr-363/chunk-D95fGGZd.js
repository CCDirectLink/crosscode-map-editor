import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{t as n}from"./chunk-BgVyGedI.js";import{t as n$1}from"./chunk-BKRxOC0a.js";import{n as o$1,t as n$2}from"./chunk-DwovsIDl.js";import{t as l}from"./chunk-B0xzTqqg.js";import{n as t$1}from"./chunk-Dk7H837M.js";import{n as f}from"./chunk-9eBNBfbZ.js";import{t as f$1}from"./chunk-JS9oXCYm.js";import{t as d}from"./chunk-0J64kcKe.js";import{t as n$3}from"./chunk-Bpqf3e5M.js";import{t as n$4}from"./chunk-Cbh_Om6c.js";var i;var o;var g;var u=H(()=>{t();f$1();n$2();l();n$3();n();n$1();t$1();o$1();f();d();n$4();i=`colorVertexShader`,o=`attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform mat4 view;
#endif
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=o);g={name:i,shader:o}});export{u as n,g as t};