import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";var a;var s;var i=H(()=>{t();a=`prePassDeclaration`,s=`#ifdef PREPASS
#ifdef PREPASS_LOCAL_POSITION
varying vPosition : vec3f;
#endif
#ifdef PREPASS_DEPTH
varying vViewPos: vec3f;
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
varying vNormViewDepth: f32;
#endif
#if defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)
varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#endif
`;e.IncludesShadersStoreWGSL[a]||(e.IncludesShadersStoreWGSL[a]=s)});var f;var p;var S=H(()=>{t();f=`oitDeclaration`,p=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#define MAX_DEPTH 99999.0
var oitDepthSamplerSampler: sampler;var oitDepthSampler: texture_2d<f32>;var oitFrontColorSamplerSampler: sampler;var oitFrontColorSampler: texture_2d<f32>;
#endif
`;e.IncludesShadersStoreWGSL[f]||(e.IncludesShadersStoreWGSL[f]=p)});var o;var d;var h=H(()=>{t();o=`depthPrePass`,d=`#ifdef DEPTHPREPASS
fragmentOutputs.color= vec4f(0.,0.,0.,1.0);return fragmentOutputs;
#endif
`;e.IncludesShadersStoreWGSL[o]||(e.IncludesShadersStoreWGSL[o]=d)});var n;var D;var l=H(()=>{t();n=`oitFragment`,D=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
var fragDepth: f32=fragmentInputs.position.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
var halfFloat: u32=pack2x16float( vec2f(fragDepth));var full: vec2f=unpack2x16float(halfFloat);fragDepth=full.x;
#endif
var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var lastDepth: vec2f=textureLoad(oitDepthSampler,fragCoord,0).rg;var lastFrontColor: vec4f=textureLoad(oitFrontColorSampler,fragCoord,0);fragmentOutputs.depth=vec2f(-MAX_DEPTH);fragmentOutputs.frontColor=lastFrontColor;fragmentOutputs.backColor= vec4f(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
var furthestDepth: f32=-lastDepth.x;var nearestDepth: f32=lastDepth.y;
#else
var nearestDepth: f32=-lastDepth.x;var furthestDepth: f32=lastDepth.y;
#endif
var alphaMultiplier: f32=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return fragmentOutputs;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
fragmentOutputs.depth=vec2f(-fragDepth,fragDepth);return fragmentOutputs;}
#endif
`;e.IncludesShadersStoreWGSL[n]||(e.IncludesShadersStoreWGSL[n]=D)});export{l as i,h as n,i as r,S as t};