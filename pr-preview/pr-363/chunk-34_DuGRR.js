import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{t as a}from"./chunk-DjiCho4_.js";import{t as n}from"./chunk-QUeeeb96.js";import{n as t$1}from"./chunk-uif5YYPe.js";import{n as s}from"./chunk-CkAcR2in.js";var i;var o;var T;var c=H(()=>{t();t$1();n();a();s();i=`linePixelShader`,o=`#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=o);T={name:i,shader:o}});export{c as n,T as t};