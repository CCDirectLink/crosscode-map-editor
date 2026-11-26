import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var i;var o;var n;var a=H(()=>{t();i=`lensFlareVertexShader`,o=`attribute vec2 position;uniform mat4 viewportMatrix;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=position*madd+madd;gl_Position=viewportMatrix*vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=o);n={name:i,shader:o}});export{n,a as t};