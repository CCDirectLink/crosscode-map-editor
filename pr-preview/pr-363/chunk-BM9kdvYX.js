import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as n}from"./chunk-BgVyGedI.js";import{t as n$1}from"./chunk-BKRxOC0a.js";import{n as o,t as n$2}from"./chunk-DwovsIDl.js";import{t as T}from"./chunk-B2EIfOYf.js";import{t as d}from"./chunk-Bu-EGwTB.js";import{t as d$1}from"./chunk-K0KgA1OK.js";import{n as t$2}from"./chunk-Dk7H837M.js";import{t as f}from"./chunk-JS9oXCYm.js";import{n as n$3}from"./chunk-DCihAtiR.js";var i;var t;var A;var S=H(()=>{t$1();f();n$2();n$3();T();n();d();d$1();n$1();t$2();o();i=`pickingVertexShader`,t=`attribute vec3 position;
#if defined(INSTANCES)
attribute vec4 instanceMeshID;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
#if defined(INSTANCES)
varying vec4 vMeshID;
#endif
void main(void) {
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;
#if defined(INSTANCES)
vMeshID=instanceMeshID;
#endif
}`;e.ShadersStore[i]||(e.ShadersStore[i]=t);A={name:i,shader:t}});export{S as n,A as t};