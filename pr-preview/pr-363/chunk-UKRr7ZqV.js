import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{t as t$1}from"./chunk-Xa0DTeW6.js";var o;var l;var a=H(()=>{t();o=`kernelBlurVertex`,l=`sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`;e.IncludesShadersStore[o]||(e.IncludesShadersStore[o]=l)});var r;var i;var E;var s=H(()=>{t();t$1();a();r=`kernelBlurVertexShader`,i=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[r]||(e.ShadersStore[r]=i);E={name:r,shader:i}});export{s as n,E as t};