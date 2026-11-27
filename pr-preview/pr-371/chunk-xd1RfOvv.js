import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as t$2}from"./chunk-Q0AITQb_.js";import{n as s,t as m}from"./chunk-DOnrwfbe.js";import{t as f}from"./chunk-CeVPvAVD.js";import{t as T}from"./chunk-BGL_6BpW.js";import{t as a}from"./chunk-CxyGEWVU.js";import{t as f$1}from"./chunk-BQcBiO4o.js";import{n as s$1}from"./chunk-DuOKw902.js";import{t as a$1}from"./chunk-8BNrKNGE.js";import{n}from"./chunk-BfrhEdoN.js";var t;var i;var A;var S=H(()=>{t$1();a$1();m();n();T();t$2();a();f$1();f();s$1();s();t=`pickingVertexShader`,i=`attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
varying vMeshID: vec4f;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(input.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=input.instanceMeshID;
#endif
}`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=i);A={name:t,shader:i}});export{S as n,A as t};