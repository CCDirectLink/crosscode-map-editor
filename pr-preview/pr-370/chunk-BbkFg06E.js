import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";import{t as a}from"./chunk-DjiCho4_.js";import{t as n$1}from"./chunk-QUeeeb96.js";import{n as t$2}from"./chunk-uif5YYPe.js";import{n as s}from"./chunk-CkAcR2in.js";import{n as n$2}from"./chunk-CzPlEBPv.js";import{t as a$1}from"./chunk-C8k4sfZh.js";import{n as f$1}from"./chunk-TJCmu4Ri.js";import{t as i}from"./chunk-7zCtH7-w.js";import{n as t$3}from"./chunk-DRY21oHU.js";import{n as s$1}from"./chunk-Bj0ysPEf.js";import{n as t$4}from"./chunk-DqOROWt-.js";import{n as t$5}from"./chunk-BZUhDBWq.js";import{n as o}from"./chunk-CzemuFGk.js";import{t as a$2}from"./chunk-Dw7BxtPC.js";import{t as f$2}from"./chunk-DolyiYpw.js";import{t as a$3}from"./chunk-D3OuV9n2.js";var n;var L;var f=H(()=>{t$1();n=`backgroundFragmentDeclaration`,L=`uniform vec4 vEyePosition;uniform vec4 vPrimaryColor;
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
uniform vec4 vPrimaryColorShadow;
#endif
uniform float shadowLevel;uniform float alpha;
#ifdef DIFFUSE
uniform vec2 vDiffuseInfos;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;
#endif
#if defined(REFLECTIONFRESNEL) || defined(OPACITYFRESNEL)
uniform vec3 vBackgroundCenter;
#endif
#ifdef REFLECTIONFRESNEL
uniform vec4 vReflectionControl;
#endif
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION)
uniform mat4 view;
#endif
#ifdef PROJECTED_GROUND
uniform vec2 projectedGroundInfos;
#endif
`;e.IncludesShadersStore[n]||(e.IncludesShadersStore[n]=L)});var l;var D;var t=H(()=>{t$1();l=`intersectionFunctions`,D=`float diskIntersectWithBackFaceCulling(vec3 ro,vec3 rd,vec3 c,float r) {float d=rd.y;if(d>0.0) { return 1e6; }
vec3 o=ro-c;float t=-o.y/d;vec3 q=o+rd*t;return (dot(q,q)<r*r) ? t : 1e6;}
vec2 sphereIntersect(vec3 ro,vec3 rd,vec3 ce,float ra) {vec3 oc=ro-ce;float b=dot(oc,rd);float c=dot(oc,oc)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}
vec2 sphereIntersectFromOrigin(vec3 ro,vec3 rd,float ra) {float b=dot(ro,rd);float c=dot(ro,ro)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}`;e.IncludesShadersStore[l]||(e.IncludesShadersStore[l]=D)});var r;var c;var Q;var N=H(()=>{t$1();f();a$2();n$2();t$4();f$1();t$5();o();a$3();s$1();i();n$1();t$2();t$3();t();s();f$2();a();a$1();r=`backgroundPixelShader`,c=`#ifdef TEXTURELODSUPPORT
#extension GL_EXT_shader_texture_lod : enable
#endif
precision highp float;
#include<__decl__backgroundFragment>
#include<helperFunctions>
varying vec3 vPositionW;
#ifdef MAINUV1
varying vec2 vMainUV1;
#endif 
#ifdef MAINUV2 
varying vec2 vMainUV2; 
#endif 
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef DIFFUSE
#if DIFFUSEDIRECTUV==1
#define vDiffuseUV vMainUV1
#elif DIFFUSEDIRECTUV==2
#define vDiffuseUV vMainUV2
#else
varying vec2 vDiffuseUV;
#endif
uniform sampler2D diffuseSampler;
#endif
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
#define sampleReflection(s,c) textureCube(s,c)
uniform samplerCube reflectionSampler;
#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) textureCubeLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;
#endif
#else
#define sampleReflection(s,c) texture2D(s,c)
uniform sampler2D reflectionSampler;
#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) texture2DLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;
#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#endif
#include<reflectionFunction>
#endif
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE;
#endif
#ifndef SHADOWONLY
#define SHADOWONLY;
#endif
#include<imageProcessingDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<imageProcessingFunctions>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#ifdef REFLECTIONFRESNEL
#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
vec3 fresnelSchlickEnvironmentGGX(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)
{float weight=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}
#endif
#ifdef PROJECTED_GROUND
#include<intersectionFunctions>
vec3 project(vec3 viewDirectionW,vec3 eyePosition) {float radius=projectedGroundInfos.x;float height=projectedGroundInfos.y;vec3 camDir=-viewDirectionW;float skySphereDistance=sphereIntersectFromOrigin(eyePosition,camDir,radius).x;vec3 skySpherePositionW=eyePosition+camDir*skySphereDistance;vec3 p=normalize(skySpherePositionW);eyePosition.y-=height;float sIntersection=sphereIntersectFromOrigin(eyePosition,p,radius).x;vec3 h=vec3(0.0,-height,0.0);float dIntersection=diskIntersectWithBackFaceCulling(eyePosition,p,h,radius);p=(eyePosition+min(sIntersection,dIntersection)*p);return p;}
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(0.0,1.0,0.0);
#endif
float shadow=1.;float globalShadow=0.;float shadowLightCount=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0..maxSimultaneousLights]
#ifdef SHADOWINUSE
globalShadow/=shadowLightCount;
#else
globalShadow=1.0;
#endif
#ifndef BACKMAT_SHADOWONLY
vec4 reflectionColor=vec4(1.,1.,1.,1.);
#ifdef REFLECTION
#ifdef PROJECTED_GROUND
vec3 reflectionVector=project(viewDirectionW,vEyePosition.xyz);reflectionVector=vec3(reflectionMatrix*vec4(reflectionVector,1.));
#else
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=reflectionVector;
#else
vec2 reflectionCoords=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0-reflectionCoords.y;
#endif
#ifdef REFLECTIONBLUR
float reflectionLOD=vReflectionInfos.y;
#ifdef TEXTURELODSUPPORT
reflectionLOD=reflectionLOD*log2(vReflectionMicrosurfaceInfos.x)*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;reflectionColor=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);
#else
float lodReflectionNormalized=saturate(reflectionLOD);float lodReflectionNormalizedDoubled=lodReflectionNormalized*2.0;vec4 reflectionSpecularMid=sampleReflection(reflectionSampler,reflectionCoords);if(lodReflectionNormalizedDoubled<1.0){reflectionColor=mix(
sampleReflection(reflectionSamplerHigh,reflectionCoords),
reflectionSpecularMid,
lodReflectionNormalizedDoubled
);} else {reflectionColor=mix(
reflectionSpecularMid,
sampleReflection(reflectionSamplerLow,reflectionCoords),
lodReflectionNormalizedDoubled-1.0
);}
#endif
#else
vec4 reflectionSample=sampleReflection(reflectionSampler,reflectionCoords);reflectionColor=reflectionSample;
#endif
#ifdef RGBDREFLECTION
reflectionColor.rgb=fromRGBD(reflectionColor);
#endif
#ifdef GAMMAREFLECTION
reflectionColor.rgb=toLinearSpace(reflectionColor.rgb);
#endif
#ifdef REFLECTIONBGR
reflectionColor.rgb=reflectionColor.bgr;
#endif
reflectionColor.rgb*=vReflectionInfos.x;
#endif
vec3 diffuseColor=vec3(1.,1.,1.);float finalAlpha=alpha;
#ifdef DIFFUSE
vec4 diffuseMap=texture2D(diffuseSampler,vDiffuseUV);
#ifdef GAMMADIFFUSE
diffuseMap.rgb=toLinearSpace(diffuseMap.rgb);
#endif
diffuseMap.rgb*=vDiffuseInfos.y;
#ifdef DIFFUSEHASALPHA
finalAlpha*=diffuseMap.a;
#endif
diffuseColor=diffuseMap.rgb;
#endif
#ifdef REFLECTIONFRESNEL
vec3 colorBase=diffuseColor;
#else
vec3 colorBase=reflectionColor.rgb*diffuseColor;
#endif
colorBase=max(colorBase,0.0);
#ifdef USERGBCOLOR
vec3 finalColor=colorBase;
#else
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
vec3 mainColor=mix(vPrimaryColorShadow.rgb,vPrimaryColor.rgb,colorBase);
#else
vec3 mainColor=vPrimaryColor.rgb;
#endif
vec3 finalColor=colorBase*mainColor;
#endif
#ifdef REFLECTIONFRESNEL
vec3 reflectionAmount=vReflectionControl.xxx;vec3 reflectionReflectance0=vReflectionControl.yyy;vec3 reflectionReflectance90=vReflectionControl.zzz;float VdotN=dot(normalize(vEyePosition.xyz),normalW);vec3 planarReflectionFresnel=fresnelSchlickEnvironmentGGX(saturate(VdotN),reflectionReflectance0,reflectionReflectance90,1.0);reflectionAmount*=planarReflectionFresnel;
#ifdef REFLECTIONFALLOFF
float reflectionDistanceFalloff=1.0-saturate(length(vPositionW.xyz-vBackgroundCenter)*vReflectionControl.w);reflectionDistanceFalloff*=reflectionDistanceFalloff;reflectionAmount*=reflectionDistanceFalloff;
#endif
finalColor=mix(finalColor,reflectionColor.rgb,saturate(reflectionAmount));
#endif
#ifdef OPACITYFRESNEL
float viewAngleToFloor=dot(normalW,normalize(vEyePosition.xyz-vBackgroundCenter));const float startAngle=0.1;float fadeFactor=saturate(viewAngleToFloor/startAngle);finalAlpha*=fadeFactor*fadeFactor;
#endif
#ifdef SHADOWINUSE
finalColor=mix(finalColor*shadowLevel,finalColor,globalShadow);
#endif
vec4 color=vec4(finalColor,finalAlpha);
#else
vec4 color=vec4(vPrimaryColor.rgb,(1.0-clamp(globalShadow,0.,1.))*alpha);
#endif
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
#if !defined(SKIPFINALCOLORCLAMP)
color.rgb=clamp(color.rgb,0.,30.0);
#endif
#else
color=applyImageProcessing(color);
#endif
#ifdef PREMULTIPLYALPHA
color.rgb*=color.a;
#endif
#ifdef NOISE
color.rgb+=dither(vPositionW.xy,0.5);color=max(color,0.0);
#endif
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;e.ShadersStore[r]||(e.ShadersStore[r]=c);Q={name:r,shader:c}});export{Q as n,N as t};