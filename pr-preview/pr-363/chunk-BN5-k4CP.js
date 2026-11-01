import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as t$2}from"./chunk-Q0AITQb_.js";import{n as s,t as m}from"./chunk-DOnrwfbe.js";import{t as f}from"./chunk-CeVPvAVD.js";import{n as l}from"./chunk-jppWb2tb.js";import{n as s$1}from"./chunk-DuOKw902.js";import{n}from"./chunk-asDSjzPn.js";import{t as a}from"./chunk-8BNrKNGE.js";import{t as d}from"./chunk-ppvrhDzL.js";import{t as n$1}from"./chunk-TLJXPjrE.js";import{t as d$1}from"./chunk-DHXTAGQu.js";var i;var t;var b;var S=H(()=>{t$1();a();m();l();n$1();t$2();f();s$1();s();n();d();d$1();i=`colorVertexShader`,t=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(input.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStoreWGSL[i]||(e.ShadersStoreWGSL[i]=t);b={name:i,shader:t}});export{b as n,S as t};