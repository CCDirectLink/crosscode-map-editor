import{a as H}from"./chunk-DBRZyZM1.js";import{n as t,t as e}from"./chunk-B_VM99PE.js";import{t as a}from"./chunk-XVguvnM5.js";import{t as a$1}from"./chunk-CeHmLSL0.js";import{t as r}from"./chunk-BXEjaTo0.js";import{t as s$1}from"./chunk-Bgd-Gbir.js";import{t as i$1}from"./chunk-DebirIEI.js";import{n as n$1}from"./chunk-BMERetGG.js";import{t as c$1}from"./chunk-jXBOd57c.js";import{n as n$2}from"./chunk-BI8AubQP.js";import{n as i$2}from"./chunk-CtC7CJPQ.js";import{n as s$2}from"./chunk-DaXpgHuN.js";import{t as m$1}from"./chunk-CkVnjhub.js";import{t as o$1}from"./chunk-BqJCA4gH.js";import{t as n$3}from"./chunk-B7s5krO3.js";import{a as H$1,c as T$1,f as y,i as F$1,l as W,n as B,o as I$1,r as D$1,s as R$1,t as A$1,u as _$1}from"./chunk-CgMIEzRA.js";import{n as n$4,t as c$2}from"./chunk-DH-80Hy5.js";import{i as l$1,n as h$1,r as i$3,t as S$1}from"./chunk-Bc_RjDaU.js";import{t as c$3}from"./chunk-_9HyusG2.js";import{t as f$1}from"./chunk-CDWxBp6y.js";import{t as s$3}from"./chunk-BrGyr0L_.js";var n;var ue;var i=H(()=>{t();i$1();n=`openpbrFragmentSamplersDeclaration`,ue=`#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_SAMPLERNAME_,baseColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_SAMPLERNAME_,baseWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_SAMPLERNAME_,baseDiffuseRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_SAMPLERNAME_,baseMetalness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_SAMPLERNAME_,specularWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_SAMPLERNAME_,specularColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_SAMPLERNAME_,specularRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_SAMPLERNAME_,specularRoughnessAnisotropy)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_SAMPLERNAME_,coatWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor,_SAMPLERNAME_,coatColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_SAMPLERNAME_,coatRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_SAMPLERNAME_,coatRoughnessAnisotropy)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_SAMPLERNAME_,coatDarkening)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_SAMPLERNAME_,geometryOpacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_SAMPLERNAME_,geometryTangent)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_TANGENT,_VARYINGNAME_,GeometryCoatTangent,_SAMPLERNAME_,geometryCoatTangent)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_SAMPLERNAME_,emissionColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_SAMPLERNAME_,ambientOcclusion)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_cube<f32>;
#ifdef LODBASEDMICROSFURACE
#else
var reflectionLowSamplerSampler: sampler;var reflectionLowSampler: texture_cube<f32>;var reflectionHighSamplerSampler: sampler;var reflectionHighSampler: texture_cube<f32>;
#endif
#ifdef USEIRRADIANCEMAP
var irradianceSamplerSampler: sampler;var irradianceSampler: texture_cube<f32>;
#endif
#else
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_2d<f32>;
#ifdef LODBASEDMICROSFURACE
#else
var reflectionLowSamplerSampler: sampler;var reflectionLowSampler: texture_2d<f32>;var reflectionHighSamplerSampler: sampler;var reflectionHighSampler: texture_2d<f32>;
#endif
#ifdef USEIRRADIANCEMAP
var irradianceSamplerSampler: sampler;var irradianceSampler: texture_2d<f32>;
#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#endif
#endif
#ifdef ENVIRONMENTBRDF
var environmentBrdfSamplerSampler: sampler;var environmentBrdfSampler: texture_2d<f32>;
#endif
#ifdef ANISOTROPIC
var blueNoiseSamplerSampler: sampler;var blueNoiseSampler: texture_2d<f32>;
#endif
#ifdef IBL_CDF_FILTERING
var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;
#endif
`;e.IncludesShadersStoreWGSL[n]||(e.IncludesShadersStoreWGSL[n]=ue)});var f;var ge;var l=H(()=>{t();f=`openpbrNormalMapFragmentMainFunctions`,ge=`#if defined(GEOMETRY_NORMAL) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#ifdef OBJECTSPACE_NORMALMAP
uniform normalMatrix: mat4x4f;fn toNormalMatrix(m: mat4x4f)->mat4x4f
{var a00=m[0][0];var a01=m[0][1];var a02=m[0][2];var a03=m[0][3];var a10=m[1][0];var a11=m[1][1];var a12=m[1][2];var a13=m[1][3];var a20=m[2][0]; 
var a21=m[2][1];var a22=m[2][2];var a23=m[2][3];var a30=m[3][0]; 
var a31=m[3][1];var a32=m[3][2];var a33=m[3][3];var b00=a00*a11-a01*a10;var b01=a00*a12-a02*a10;var b02=a00*a13-a03*a10;var b03=a01*a12-a02*a11;var b04=a01*a13-a03*a11;var b05=a02*a13-a03*a12;var b06=a20*a31-a21*a30;var b07=a20*a32-a22*a30;var b08=a20*a33-a23*a30;var b09=a21*a32-a22*a31;var b10=a21*a33-a23*a31;var b11=a22*a33-a23*a32;var det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;var mi=mat4x4<f32>(
(a11*b11-a12*b10+a13*b09)/det,
(a02*b10-a01*b11-a03*b09)/det,
(a31*b05-a32*b04+a33*b03)/det,
(a22*b04-a21*b05-a23*b03)/det,
(a12*b08-a10*b11-a13*b07)/det,
(a00*b11-a02*b08+a03*b07)/det,
(a32*b02-a30*b05-a33*b01)/det,
(a20*b05-a22*b02+a23*b01)/det,
(a10*b10-a11*b08+a13*b06)/det,
(a01*b08-a00*b10-a03*b06)/det,
(a30*b04-a31*b02+a33*b00)/det,
(a21*b02-a20*b04-a23*b00)/det,
(a11*b07-a10*b09-a12*b06)/det,
(a00*b09-a01*b07+a02*b06)/det,
(a31*b01-a30*b03-a32*b00)/det,
(a20*b03-a21*b01+a22*b00)/det);return mat4x4<f32>(mi[0][0],mi[1][0],mi[2][0],mi[3][0],
mi[0][1],mi[1][1],mi[2][1],mi[3][1],
mi[0][2],mi[1][2],mi[2][2],mi[3][2],
mi[0][3],mi[1][3],mi[2][3],mi[3][3]);}
#endif
fn perturbNormalBase(cotangentFrame: mat3x3f,normal: vec3f,scale: f32)->vec3f
{var output=normal;
#ifdef NORMALXYSCALE
output=normalize(output* vec3f(scale,scale,1.0));
#endif
return normalize(cotangentFrame*output);}
fn perturbNormal(cotangentFrame: mat3x3f,textureSample: vec3f,scale: f32)->vec3f
{return perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);}
fn cotangent_frame(normal: vec3f,p: vec3f,uv: vec2f,tangentSpaceParams: vec2f)->mat3x3f
{var dp1: vec3f=dpdx(p);var dp2: vec3f=dpdy(p);var duv1: vec2f=dpdx(uv);var duv2: vec2f=dpdy(uv);var dp2perp: vec3f=cross(dp2,normal);var dp1perp: vec3f=cross(normal,dp1);var tangent: vec3f=dp2perp*duv1.x+dp1perp*duv2.x;var bitangent: vec3f=dp2perp*duv1.y+dp1perp*duv2.y;tangent*=tangentSpaceParams.x;bitangent*=tangentSpaceParams.y;var det: f32=max(dot(tangent,tangent),dot(bitangent,bitangent));var invmax: f32=select(inverseSqrt(det),0.0,det==0.0);return mat3x3f(tangent*invmax,bitangent*invmax,normal);}
#endif
`;e.IncludesShadersStoreWGSL[f]||(e.IncludesShadersStoreWGSL[f]=ge)});var c;var _e;var s=H(()=>{t();i$1();c=`openpbrNormalMapFragmentFunctions`,_e=`#if defined(GEOMETRY_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_SAMPLERNAME_,geometryNormal)
#endif
#if defined(GEOMETRY_COAT_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_SAMPLERNAME_,geometryCoatNormal)
#endif
#if defined(DETAIL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_SAMPLERNAME_,detail)
#endif
#if defined(GEOMETRY_NORMAL) && defined(PARALLAX)
const minSamples: f32=4.;const maxSamples: f32=15.;const iMaxSamples: i32=15;fn parallaxOcclusion(vViewDirCoT: vec3f,vNormalCoT: vec3f,texCoord: vec2f,parallaxScale: f32)->vec2f {var parallaxLimit: f32=length(vViewDirCoT.xy)/vViewDirCoT.z;parallaxLimit*=parallaxScale;var vOffsetDir: vec2f=normalize(vViewDirCoT.xy);var vMaxOffset: vec2f=vOffsetDir*parallaxLimit;var numSamples: f32=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));var stepSize: f32=1.0/numSamples;var currRayHeight: f32=1.0;var vCurrOffset: vec2f= vec2f(0,0);var vLastOffset: vec2f= vec2f(0,0);var lastSampledHeight: f32=1.0;var currSampledHeight: f32=1.0;var keepWorking: bool=true;for (var i: i32=0; i<iMaxSamples; i++)
{currSampledHeight=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,texCoord+vCurrOffset).w;if (!keepWorking)
{}
else if (currSampledHeight>currRayHeight)
{var delta1: f32=currSampledHeight-currRayHeight;var delta2: f32=(currRayHeight+stepSize)-lastSampledHeight;var ratio: f32=delta1/(delta1+delta2);vCurrOffset=(ratio)* vLastOffset+(1.0-ratio)*vCurrOffset;keepWorking=false;}
else
{currRayHeight-=stepSize;vLastOffset=vCurrOffset;
#ifdef PARALLAX_RHS
vCurrOffset-=stepSize*vMaxOffset;
#else
vCurrOffset+=stepSize*vMaxOffset;
#endif
lastSampledHeight=currSampledHeight;}}
return vCurrOffset;}
fn parallaxOffset(viewDir: vec3f,heightScale: f32)->vec2f
{var height: f32=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV).w;var texCoordOffset: vec2f=heightScale*viewDir.xy*height;
#ifdef PARALLAX_RHS
return texCoordOffset;
#else
return -texCoordOffset;
#endif
}
#endif
`;e.IncludesShadersStoreWGSL[c]||(e.IncludesShadersStoreWGSL[c]=_e)});var m;var ve;var d=H(()=>{t();m=`openpbrDielectricReflectance`,ve=`struct ReflectanceParams
{F0: f32,
F90: f32,
coloredF0: vec3f,
coloredF90: vec3f,};
#define pbr_inline
fn dielectricReflectance(
insideIOR: f32,outsideIOR: f32,specularColor: vec3f,specularWeight: f32
)->ReflectanceParams
{var outParams: ReflectanceParams;let dielectricF0=pow((insideIOR-outsideIOR)/(insideIOR+outsideIOR),2.0);
#if DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_GLTF
let maxF0=max(specularColor.r,max(specularColor.g,specularColor.b));outParams.F0=dielectricF0*maxF0*specularWeight;
#else
outParams.F0=dielectricF0*specularWeight;
#endif
let f90Scale=clamp(2.0f*abs(insideIOR-outsideIOR),0.0f,1.0f);outParams.F90=f90Scale*specularWeight;outParams.coloredF0=vec3f(dielectricF0*specularWeight)*specularColor.rgb;
#if (DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_OPENPBR)
let dielectricColorF90: vec3f=specularColor.rgb*vec3f(f90Scale)*specularWeight;
#else
let dielectricColorF90: vec3f=vec3f(f90Scale)*specularWeight;
#endif
outParams.coloredF90=dielectricColorF90;return outParams;}
`;e.IncludesShadersStoreWGSL[m]||(e.IncludesShadersStoreWGSL[m]=ve)});var p;var Se;var u=H(()=>{t();p=`openpbrConductorReflectance`,Se=`#define pbr_inline
fn conductorReflectance(baseColor: vec3f,specularColor: vec3f,specularWeight: f32)->ReflectanceParams
{var outParams: ReflectanceParams;
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
outParams.coloredF0=baseColor*specularWeight;outParams.coloredF90=specularColor*specularWeight;
#else
outParams.coloredF0=baseColor;outParams.coloredF90=vec3f(1.0f);
#endif
outParams.F0=1.0f;outParams.F90=1.0f;return outParams;}`;e.IncludesShadersStoreWGSL[p]||(e.IncludesShadersStoreWGSL[p]=Se)});var g;var Ie;var _=H(()=>{t();g=`openpbrBlockAmbientOcclusion`,Ie=`struct ambientOcclusionOutParams
{ambientOcclusionColor: vec3f,
#if DEBUGMODE>0 && defined(AMBIENT_OCCLUSION)
ambientOcclusionColorMap: vec3f
#endif
};
#define pbr_inline
fn ambientOcclusionBlock(
#ifdef AMBIENT_OCCLUSION
ambientOcclusionColorMap_: vec3f,
ambientInfos: vec2f
#endif
)->ambientOcclusionOutParams
{ 
var outParams: ambientOcclusionOutParams;var ambientOcclusionColor: vec3f= vec3f(1.,1.,1.);
#ifdef AMBIENT_OCCLUSION
var ambientOcclusionColorMap: vec3f=ambientOcclusionColorMap_*ambientInfos.y;
#ifdef AMBIENTINGRAYSCALE
ambientOcclusionColorMap= vec3f(ambientOcclusionColorMap.r,ambientOcclusionColorMap.r,ambientOcclusionColorMap.r);
#endif
#if DEBUGMODE>0
outParams.ambientOcclusionColorMap=ambientOcclusionColorMap;
#endif
#endif
outParams.ambientOcclusionColor=ambientOcclusionColor;return outParams;}
`;e.IncludesShadersStoreWGSL[g]||(e.IncludesShadersStoreWGSL[g]=Ie)});var v;var Ee;var S=H(()=>{t();v=`openpbrGeometryInfo`,Ee=`struct geometryInfoOutParams
{NdotV: f32,
NdotVUnclamped: f32,
environmentBrdf: vec3f,
horizonOcclusion: f32};
#ifdef ANISOTROPIC
struct geometryInfoAnisoOutParams
{NdotV: f32,
NdotVUnclamped: f32,
environmentBrdf: vec3f,
horizonOcclusion: f32,
anisotropy: f32,
anisotropicTangent: vec3f,
anisotropicBitangent: vec3f,
TBN: mat3x3<f32>};
#endif
fn geometryInfo(
normalW: vec3f,viewDirectionW: vec3f,roughness: f32,geometricNormalW: vec3f
)->geometryInfoOutParams
{var outParams: geometryInfoOutParams;outParams.NdotVUnclamped=dot(normalW,viewDirectionW);outParams.NdotV=absEps(outParams.NdotVUnclamped);
#if defined(ENVIRONMENTBRDF)
outParams.environmentBrdf=getBRDFLookup(outParams.NdotV,roughness);
#else
outParams.environmentBrdf=vec3f(0.0);
#endif
outParams.horizonOcclusion=1.0f;
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef HORIZONOCCLUSION
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
#ifdef REFLECTIONMAP_3D
outParams.horizonOcclusion=environmentHorizonOcclusion(-viewDirectionW,normalW,geometricNormalW);
#endif
#endif
#endif
#endif
return outParams;}
#ifdef ANISOTROPIC
fn geometryInfoAniso(
normalW: vec3f,viewDirectionW: vec3f,roughness: f32,geometricNormalW: vec3f
,vAnisotropy: vec3f,TBN: mat3x3<f32>
)->geometryInfoAnisoOutParams
{let geoInfo: geometryInfoOutParams=geometryInfo(normalW,viewDirectionW,roughness,geometricNormalW);var outParams: geometryInfoAnisoOutParams;outParams.NdotV=geoInfo.NdotV;outParams.NdotVUnclamped=geoInfo.NdotVUnclamped;outParams.environmentBrdf=geoInfo.environmentBrdf;outParams.horizonOcclusion=geoInfo.horizonOcclusion;outParams.anisotropy=vAnisotropy.b;let anisotropyDirection: vec3f=vec3f(vAnisotropy.xy,0.);let anisoTBN: mat3x3<f32>=mat3x3<f32>(normalize(TBN[0]),normalize(TBN[1]),normalize(TBN[2]));outParams.anisotropicTangent=normalize(anisoTBN*anisotropyDirection);outParams.anisotropicBitangent=normalize(cross(anisoTBN[2],outParams.anisotropicTangent));outParams.TBN=TBN;return outParams;}
#endif
`;e.IncludesShadersStoreWGSL[v]||(e.IncludesShadersStoreWGSL[v]=Ee)});var I;var Re;var E=H(()=>{t();I=`openpbrIblFunctions`,Re=`#ifdef REFLECTION
fn sampleIrradiance(
surfaceNormal: vec3f
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradianceSH: vec3f
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,iblMatrix: mat4x4f
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
,irradianceSampler: texture_cube<f32>
,irradianceSamplerSampler: sampler
#else
,irradianceSampler: texture_2d<f32>
,irradianceSamplerSampler: sampler
#endif
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,reflectionDominantDirection: vec3f
#endif
#endif
#ifdef REALTIME_FILTERING
,reflectionFilteringInfo: vec2f
#ifdef IBL_CDF_FILTERING
,icdfSampler: texture_2d<f32>
,icdfSamplerSampler: sampler
#endif
#endif
,reflectionInfos: vec2f
,viewDirectionW: vec3f
,diffuseRoughness: f32
,surfaceAlbedo: vec3f
)->vec3f {var environmentIrradiance=vec3f(0.,0.,0.);
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
var irradianceVector=(iblMatrix*vec4f(surfaceNormal,0.0f)).xyz;let irradianceView=(iblMatrix*vec4f(viewDirectionW,0.0f)).xyz;
#if !defined(USE_IRRADIANCE_DOMINANT_DIRECTION) && !defined(REALTIME_FILTERING)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
{let NdotV=max(dot(surfaceNormal,viewDirectionW),0.0f);irradianceVector=mix(irradianceVector,irradianceView,(0.5f*(1.0f-NdotV))*diffuseRoughness);}
#endif
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0f;
#endif
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0f;
#endif
#endif
#ifdef USESPHERICALFROMREFLECTIONMAP
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
environmentIrradiance=vEnvironmentIrradianceSH;
#else
#if defined(REALTIME_FILTERING)
environmentIrradiance=irradiance(reflectionSampler,reflectionSamplerSampler,irradianceVector,reflectionFilteringInfo,diffuseRoughness,surfaceAlbedo,irradianceView
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
);
#else
environmentIrradiance=computeEnvironmentIrradiance(irradianceVector);
#endif
#endif
#elif defined(USEIRRADIANCEMAP)
#ifdef REFLECTIONMAP_3D
let environmentIrradianceFromTexture: vec4f=textureSample(irradianceSampler,irradianceSamplerSampler,irradianceVector);
#else
let environmentIrradianceFromTexture: vec4f=textureSample(irradianceSampler,irradianceSamplerSampler,reflectionCoords);
#endif
environmentIrradiance=environmentIrradianceFromTexture.rgb;
#ifdef RGBDREFLECTION
environmentIrradiance.rgb=fromRGBD(environmentIrradianceFromTexture);
#endif
#ifdef GAMMAREFLECTION
environmentIrradiance.rgb=toLinearSpace(environmentIrradiance.rgb);
#endif
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
let Ls: vec3f=normalize(reflectionDominantDirection);let NoL: f32=dot(irradianceVector,Ls);let NoV: f32=dot(irradianceVector,irradianceView);var diffuseRoughnessTerm=vec3f(1.0f);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
let LoV: f32=dot (Ls,irradianceView);let mag: f32=length(reflectionDominantDirection)*2.0f;let clampedAlbedo: vec3f=clamp(surfaceAlbedo,vec3f(0.1f),vec3f(1.0f));diffuseRoughnessTerm=diffuseBRDF_EON(clampedAlbedo,diffuseRoughness,NoL,NoV,LoV)*PI;diffuseRoughnessTerm=diffuseRoughnessTerm/clampedAlbedo;diffuseRoughnessTerm=mix(vec3f(1.0f),diffuseRoughnessTerm,sqrt(clamp(mag*NoV,0.0f,1.0f)));
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
let H: vec3f=(irradianceView+Ls)*0.5f;let VoH: f32=dot(irradianceView,H);diffuseRoughnessTerm=vec3f(diffuseBRDF_Burley(NoL,NoV,VoH,diffuseRoughness)*PI);
#endif
environmentIrradiance=environmentIrradiance.rgb*diffuseRoughnessTerm;
#endif
#endif
environmentIrradiance*=reflectionInfos.x;return environmentIrradiance;}
#ifdef REFLECTIONMAP_3D
fn createReflectionCoords(vPositionW: vec3f,normalW: vec3f)->vec3f
#else
fn createReflectionCoords(vPositionW: vec3f,normalW: vec3f)->vec2f
#endif
{var reflectionVector: vec3f=computeReflectionCoords(vec4f(vPositionW,1.0f),normalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=reflectionVector;
#else
var reflectionCoords: vec2f=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0f-reflectionCoords.y;
#endif
return reflectionCoords;}
fn sampleRadiance(
alphaG: f32
,reflectionMicrosurfaceInfos: vec3f
,reflectionInfos: vec2f
,geoInfo: geometryInfoOutParams
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec3f
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec2f
#endif
#ifdef REALTIME_FILTERING
,reflectionFilteringInfo: vec2f
#endif
)->vec3f {var environmentRadiance: vec4f=vec4f(0.f,0.f,0.f,0.f);
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,alphaG,geoInfo.NdotVUnclamped);
#elif defined(LINEARSPECULARREFLECTION)
var reflectionLOD: f32=getLinearLodFromRoughness(reflectionMicrosurfaceInfos.x,roughness);
#else
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,alphaG);
#endif
reflectionLOD=reflectionLOD*reflectionMicrosurfaceInfos.y+reflectionMicrosurfaceInfos.z;
#ifdef REALTIME_FILTERING
environmentRadiance=vec4f(radiance(alphaG,reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionFilteringInfo),1.0f);
#else
environmentRadiance=textureSampleLevel(reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionLOD);
#endif
#ifdef RGBDREFLECTION
environmentRadiance.rgb=fromRGBD(environmentRadiance);
#endif
#ifdef GAMMAREFLECTION
environmentRadiance.rgb=toLinearSpace(environmentRadiance.rgb);
#endif
return environmentRadiance.rgb;}
#if defined(ANISOTROPIC)
fn sampleRadianceAnisotropic(
alphaG: f32
,reflectionMicrosurfaceInfos: vec3f
,reflectionInfos: vec2f
,geoInfo: geometryInfoAnisoOutParams
,normalW: vec3f
,viewDirectionW: vec3f
,positionW: vec3f
,noise: vec3f
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
#endif
#ifdef REALTIME_FILTERING
,reflectionFilteringInfo: vec2f
#endif
)->vec3f {var environmentRadiance: vec4f=vec4f(0.f,0.f,0.f,0.f);let alphaT=alphaG*sqrt(2.0f/(1.0f+(1.0f-geoInfo.anisotropy)*(1.0f-geoInfo.anisotropy)));let alphaB=(1.0f-geoInfo.anisotropy)*alphaT;let modifiedAlphaG=alphaB;
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,modifiedAlphaG,geoInfo.NdotVUnclamped);
#elif defined(LINEARSPECULARREFLECTION)
var reflectionLOD: f32=getLinearLodFromRoughness(reflectionMicrosurfaceInfos.x,roughness);
#else
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,modifiedAlphaG);
#endif
reflectionLOD=reflectionLOD*reflectionMicrosurfaceInfos.y+reflectionMicrosurfaceInfos.z;
#ifdef REALTIME_FILTERING
var view=(uniforms.reflectionMatrix*vec4f(viewDirectionW,0.0f)).xyz;var tangent=(uniforms.reflectionMatrix*vec4f(geoInfo.anisotropicTangent,0.0f)).xyz;var bitangent=(uniforms.reflectionMatrix*vec4f(geoInfo.anisotropicBitangent,0.0f)).xyz;var normal=(uniforms.reflectionMatrix*vec4f(normalW,0.0f)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
view.z*=-1.0f;tangent.z*=-1.0f;bitangent.z*=-1.0f;normal.z*=-1.0f;
#endif
environmentRadiance =
vec4f(radianceAnisotropic(alphaT,alphaB,reflectionSampler,reflectionSamplerSampler,
view,tangent,
bitangent,normal,
reflectionFilteringInfo,noise.xy),
1.0f);
#else
const samples: i32=16;var radianceSample=vec4f(0.0);var accumulatedRadiance=vec3f(0.0);var reflectionCoords=vec3f(0.0);var sample_weight=0.0f;var total_weight=0.0f;let step=1.0f/f32(max(samples-1,1));for (var i: i32=0; i<samples; i++) {var t: f32=mix(-1.0,1.0,f32(i)*step);t+=step*2.0*noise.x;sample_weight=max(1.0-abs(t),0.001);sample_weight*=sample_weight;t*=min(4.0*alphaT*geoInfo.anisotropy,1.0);var bentNormal: vec3f;if (t<0.0) {let blend: f32=t+1.0;bentNormal=normalize(mix(-geoInfo.anisotropicTangent,normalW,blend));} else if (t>0.0) {let blend: f32=t;bentNormal=normalize(mix(normalW,geoInfo.anisotropicTangent,blend));} else {bentNormal=normalW;}
reflectionCoords=createReflectionCoords(positionW,bentNormal);radianceSample=textureSampleLevel(reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionLOD);
#ifdef RGBDREFLECTION
accumulatedRadiance+=vec3f(sample_weight)*fromRGBD(radianceSample);
#elif defined(GAMMAREFLECTION)
accumulatedRadiance+=vec3f(sample_weight)*toLinearSpace(radianceSample.rgb);
#else
accumulatedRadiance+=vec3f(sample_weight)*radianceSample.rgb;
#endif
total_weight+=sample_weight;}
environmentRadiance=vec4f(accumulatedRadiance/vec3f(total_weight),1.0f);
#endif
environmentRadiance=vec4f(environmentRadiance.rgb*reflectionInfos.xxx,environmentRadiance.a);return environmentRadiance.rgb;}
#endif
fn conductorIblFresnel(reflectance: ReflectanceParams,NdotV: f32,roughness: f32,environmentBrdf: vec3f)->vec3f
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
let albedoF0: vec3f=mix(reflectance.coloredF0,pow(reflectance.coloredF0,vec3f(1.4f)),roughness);return getF82Specular(NdotV,albedoF0,reflectance.coloredF90,roughness);
#else
return getReflectanceFromBRDFLookup(reflectance.coloredF0,reflectance.coloredF90,environmentBrdf);
#endif
}
#endif
`;e.IncludesShadersStoreWGSL[I]||(e.IncludesShadersStoreWGSL[I]=Re)});var R;var Ne;var N=H(()=>{t();R=`openpbrNormalMapFragment`,Ne=`var uvOffset: vec2f= vec2f(0.0,0.0);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(PARALLAX) || defined(DETAIL)
#ifdef NORMALXYSCALE
var normalScale: f32=1.0;
#elif defined(GEOMETRY_NORMAL)
var normalScale: f32=uniforms.vGeometryNormalInfos.y;
#else
var normalScale: f32=1.0;
#endif
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2); 
#elif defined(GEOMETRY_NORMAL)
var TBNUV: vec2f=select(-fragmentInputs.vGeometryNormalUV,fragmentInputs.vGeometryNormalUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV,uniforms.vTangentSpaceParams);
#else
var TBNUV: vec2f=select(-fragmentInputs.vDetailUV,fragmentInputs.vDetailUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#elif defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2);
#else
var TBNUV: vec2f=select( -fragmentInputs.vMainUV1,fragmentInputs.vMainUV1,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#endif
#ifdef PARALLAX
var invTBN: mat3x3f=transposeMat3(TBN);
#ifdef PARALLAXOCCLUSION
#else
#endif
#endif
#ifdef DETAIL
var detailColor: vec4f=textureSample(detailSampler,detailSamplerSampler,fragmentInputs.vDetailUV+uvOffset);var detailNormalRG: vec2f=detailColor.wy*2.0-1.0;var detailNormalB: f32=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));var detailNormal: vec3f= vec3f(detailNormalRG,detailNormalB);
#endif
#ifdef GEOMETRY_COAT_NORMAL
coatNormalW=perturbNormal(TBN,textureSample(geometryCoatNormalSampler,geometryCoatNormalSamplerSampler,fragmentInputs.vGeometryCoatNormalUV+uvOffset).xyz,uniforms.vGeometryCoatNormalInfos.y);
#endif
#ifdef GEOMETRY_NORMAL
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(textureSample(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV).xyz *2.0-1.0);normalW=normalize(mat3x3f(uniforms.normalMatrix[0].xyz,uniforms.normalMatrix[1].xyz,uniforms.normalMatrix[2].xyz)*normalW);
#elif !defined(DETAIL)
normalW=perturbNormal(TBN,textureSample(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV+uvOffset).xyz,uniforms.vGeometryNormalInfos.y);
#else
var sampledNormal: vec3f=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV+uvOffset).xyz*2.0-1.0;
#if DETAIL_NORMALBLENDMETHOD==0 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);var blendedNormal: vec3f=normalize( vec3f(sampledNormal.xy+detailNormal.xy,sampledNormal.z*detailNormal.z));
#elif DETAIL_NORMALBLENDMETHOD==1 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);sampledNormal+= vec3f(0.0,0.0,1.0);detailNormal*= vec3f(-1.0,-1.0,1.0);var blendedNormal: vec3f=sampledNormal*dot(sampledNormal,detailNormal)/sampledNormal.z-detailNormal;
#endif
normalW=perturbNormalBase(TBN,blendedNormal,uniforms.vGeometryNormalInfos.y);
#endif
#elif defined(DETAIL)
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);normalW=perturbNormalBase(TBN,detailNormal,uniforms.vDetailInfos.z);
#endif
`;e.IncludesShadersStoreWGSL[R]||(e.IncludesShadersStoreWGSL[R]=Ne)});var h;var he;var L=H(()=>{t();h=`openpbrBlockNormalFinal`,he=`#if defined(FORCENORMALFORWARD) && defined(NORMAL)
var faceNormal: vec3f=normalize(cross(dpdx(fragmentInputs.vPositionW),dpdy(fragmentInputs.vPositionW)))*scene.vEyePosition.w;
#if defined(TWOSIDEDLIGHTING)
faceNormal=select(-faceNormal,faceNormal,fragmentInputs.frontFacing);
#endif
normalW*=sign(dot(normalW,faceNormal));coatNormalW*=sign(dot(coatNormalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
#if defined(MIRRORED)
normalW=select(normalW,-normalW,fragmentInputs.frontFacing);coatNormalW=select(coatNormalW,-coatNormalW,fragmentInputs.frontFacing);
#else
normalW=select(-normalW,normalW,fragmentInputs.frontFacing);coatNormalW=select(-coatNormalW,coatNormalW,fragmentInputs.frontFacing);
#endif
#endif
`;e.IncludesShadersStoreWGSL[h]||(e.IncludesShadersStoreWGSL[h]=he)});var A;var Le;var O=H(()=>{t();A=`openpbrBaseLayerData`,Le=`var base_color=vec3f(0.8);var base_metalness: f32=0.0;var base_diffuse_roughness: f32=0.0;var specular_weight: f32=1.0;var specular_roughness: f32=0.3;var specular_color: vec3f=vec3f(1.0);var specular_roughness_anisotropy: f32=0.0;var specular_ior: f32=1.5;var alpha: f32=1.0;var geometry_tangent: vec2f=vec2f(1.0,0.0);
#ifdef BASE_WEIGHT
let baseWeightFromTexture: vec4f=textureSample(baseWeightSampler,baseWeightSamplerSampler,fragmentInputs.vBaseWeightUV+uvOffset);
#endif
#ifdef BASE_COLOR
let baseColorFromTexture: vec4f=textureSample(baseColorSampler,baseColorSamplerSampler,fragmentInputs.vBaseColorUV+uvOffset);
#endif
#ifdef BASE_METALNESS
let metallicFromTexture: vec4f=textureSample(baseMetalnessSampler,baseMetalnessSamplerSampler,fragmentInputs.vBaseMetalnessUV+uvOffset);
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
let baseDiffuseRoughnessFromTexture: f32=textureSample(baseDiffuseRoughnessSampler,baseDiffuseRoughnessSamplerSampler,fragmentInputs.vBaseDiffuseRoughnessUV+uvOffset).r;
#endif
#ifdef GEOMETRY_TANGENT
let geometryTangentFromTexture: vec3f=textureSample(geometryTangentSampler,geometryTangentSamplerSampler,fragmentInputs.vGeometryTangentUV+uvOffset).rgb;
#endif
#ifdef SPECULAR_ROUGHNESS_ANISOTROPY
let anisotropyFromTexture: f32=textureSample(specularRoughnessAnisotropySampler,specularRoughnessAnisotropySamplerSampler,fragmentInputs.vSpecularRoughnessAnisotropyUV+uvOffset).r*uniforms.vSpecularRoughnessAnisotropyInfos.y;
#endif
#ifdef GEOMETRY_OPACITY
let opacityFromTexture: vec4f=textureSample(opacitySampler,opacitySamplerSampler,fragmentInputs.vOpacityUV+uvOffset);
#endif
#ifdef DECAL
let decalFromTexture: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#endif
#ifdef SPECULAR_COLOR
let specularColorFromTexture: vec4f=textureSample(specularColorSampler,specularColorSamplerSampler,fragmentInputs.vSpecularColorUV+uvOffset);
#endif
#if defined(SPECULAR_WEIGHT)
#ifdef SPECULAR_WEIGHT_IN_ALPHA
let specularWeightFromTexture: f32=textureSample(specularWeightSampler,specularWeightSamplerSampler,fragmentInputs.vSpecularWeightUV+uvOffset).a;
#else
let specularWeightFromTexture: f32=textureSample(specularWeightSampler,specularWeightSamplerSampler,fragmentInputs.vSpecularWeightUV+uvOffset).r;
#endif
#endif
#ifdef ANISOTROPIC
let noise=textureSample(blueNoiseSampler,blueNoiseSamplerSampler,fragmentInputs.position.xy/256.0).xyz;
#endif
#if defined(ROUGHNESSSTOREINMETALMAPGREEN) && defined(BASE_METALNESS)
let roughnessFromTexture: f32=metallicFromTexture.g;
#elif defined(SPECULAR_ROUGHNESS)
let roughnessFromTexture: f32=textureSample(specularRoughnessSampler,specularRoughnessSamplerSampler,fragmentInputs.vSpecularRoughnessUV+uvOffset).r;
#endif
base_color=uniforms.vBaseColor.rgb;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
base_color*=uniforms.vColor.rgb;
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=uniforms.vColor.a;
#endif
base_color*=vec3(uniforms.vBaseWeight);alpha=uniforms.vBaseColor.a;base_metalness=uniforms.vReflectanceInfo.x;base_diffuse_roughness=uniforms.vBaseDiffuseRoughness;specular_roughness=uniforms.vReflectanceInfo.y;specular_color=uniforms.vSpecularColor.rgb;specular_weight=uniforms.vReflectanceInfo.a;specular_ior=uniforms.vReflectanceInfo.z;specular_roughness_anisotropy=uniforms.vSpecularAnisotropy.b;geometry_tangent=uniforms.vSpecularAnisotropy.rg;
#ifdef BASE_COLOR
#ifdef BASE_COLOR_GAMMA
base_color*=toLinearSpace(baseColorFromTexture.rgb);
#else
base_color*=baseColorFromTexture.rgb;
#endif
base_color*=uniforms.vBaseColorInfos.y;
#endif
#ifdef BASE_WEIGHT
base_color*=baseWeightFromTexture.r;
#endif
#if defined(BASE_COLOR) && defined(ALPHA_FROM_BASE_COLOR_TEXTURE)
alpha*=baseColorFromTexture.a;
#elif defined(GEOMETRY_OPACITY)
alpha*=opacityFromTexture.a;alpha*=uniforms.vGeometryOpacityInfos.y;
#endif
#ifdef ALPHATEST
#if DEBUGMODE != 88
if (alpha<ALPHATESTVALUE)
discard;
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
#ifdef BASE_METALNESS
#ifdef METALLNESSSTOREINMETALMAPBLUE
base_metalness*=metallicFromTexture.b;
#else
base_metalness*=metallicFromTexture.r;
#endif
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
base_diffuse_roughness*=baseDiffuseRoughnessFromTexture*uniforms.vBaseDiffuseRoughnessInfos.y;
#endif
#ifdef SPECULAR_COLOR
#ifdef SPECULAR_COLOR_GAMMA
specular_color*=toLinearSpace(specularColorFromTexture.rgb);
#else
specular_color*=specularColorFromTexture.rgb;
#endif
#endif
#ifdef SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE
specular_weight*=specularColorFromTexture.a;
#elif defined(SPECULAR_WEIGHT)
specular_weight*=specularWeightFromTexture;
#endif
#if defined(SPECULAR_ROUGHNESS) || (defined(ROUGHNESSSTOREINMETALMAPGREEN) && defined(BASE_METALNESS))
specular_roughness*=roughnessFromTexture;
#endif
#ifdef GEOMETRY_TANGENT
{let tangentFromTexture: vec2f=normalize(geometryTangentFromTexture.xy*vec2f(2.0f)-vec2f(1.0f));let tangent_angle_texture: f32=atan2(tangentFromTexture.y,tangentFromTexture.x);let tangent_angle_uniform: f32=atan2(geometry_tangent.y,geometry_tangent.x);let tangent_angle: f32=tangent_angle_texture+tangent_angle_uniform;geometry_tangent=vec2f(cos(tangent_angle),sin(tangent_angle));}
#endif
#if defined(GEOMETRY_TANGENT) && defined(SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
specular_roughness_anisotropy*=geometryTangentFromTexture.b;
#elif defined(SPECULAR_ROUGHNESS_ANISOTROPY)
specular_roughness_anisotropy*=anisotropyFromTexture;
#endif
#ifdef DETAIL
let detailRoughness: f32=mix(0.5f,detailColor.b,vDetailInfos.w);let loLerp: f32=mix(0.f,specular_roughness,detailRoughness*2.f);let hiLerp: f32=mix(specular_roughness,1.f,(detailRoughness-0.5f)*2.f);specular_roughness=mix(loLerp,hiLerp,step(detailRoughness,0.5f));
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
let baseAlpha: f32=specular_roughness*specular_roughness;let roughnessT: f32=mix(baseAlpha,1.0f,specular_roughness_anisotropy*specular_roughness_anisotropy);let roughnessB: f32=baseAlpha;specular_roughness_anisotropy=1.0f-roughnessB/max(roughnessT,0.00001f);specular_roughness=sqrt(roughnessT/sqrt(2.0f/(1.0f+(1.0f-specular_roughness_anisotropy)*(1.0f-specular_roughness_anisotropy))));
#endif
`;e.IncludesShadersStoreWGSL[A]||(e.IncludesShadersStoreWGSL[A]=Le)});var T;var Ae;var b=H(()=>{t();T=`openpbrCoatLayerData`,Ae=`var coat_weight: f32=0.0f;var coat_color: vec3f=vec3f(1.0f);var coat_roughness: f32=0.0f;var coat_roughness_anisotropy: f32=0.0f;var coat_ior: f32=1.6f;var coat_darkening: f32=1.0f;var geometry_coat_tangent: vec2f=vec2f(1.0f,0.0f);
#ifdef COAT_WEIGHT
var coatWeightFromTexture: vec4f=textureSample(coatWeightSampler,coatWeightSamplerSampler,fragmentInputs.vCoatWeightUV+uvOffset);
#endif
#ifdef COAT_COLOR
var coatColorFromTexture: vec4f=textureSample(coatColorSampler,coatColorSamplerSampler,fragmentInputs.vCoatColorUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS
var coatRoughnessFromTexture: vec4f=textureSample(coatRoughnessSampler,coatRoughnessSamplerSampler,fragmentInputs.vCoatRoughnessUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS_ANISOTROPY
var coatRoughnessAnisotropyFromTexture: f32=textureSample(coatRoughnessAnisotropySampler,coatRoughnessAnisotropySamplerSampler,fragmentInputs.vCoatRoughnessAnisotropyUV+uvOffset).r;
#endif
#ifdef COAT_DARKENING
var coatDarkeningFromTexture: vec4f=textureSample(coatDarkeningSampler,coatDarkeningSamplerSampler,fragmentInputs.vCoatDarkeningUV+uvOffset);
#endif
#ifdef GEOMETRY_COAT_TANGENT
var geometryCoatTangentFromTexture: vec3f=textureSample(geometryCoatTangentSampler,geometryCoatTangentSamplerSampler,fragmentInputs.vGeometryCoatTangentUV+uvOffset).rgb;
#endif
coat_color=uniforms.vCoatColor.rgb;coat_weight=uniforms.vCoatWeight;coat_roughness=uniforms.vCoatRoughness;coat_roughness_anisotropy=uniforms.vCoatRoughnessAnisotropy;coat_ior=uniforms.vCoatIor;coat_darkening=uniforms.vCoatDarkening;geometry_coat_tangent=uniforms.vGeometryCoatTangent.rg;
#ifdef COAT_WEIGHT
coat_weight*=coatWeightFromTexture.r;
#endif
#ifdef COAT_COLOR
#ifdef COAT_COLOR_GAMMA
coat_color*=toLinearSpace(coatColorFromTexture.rgb);
#else
coat_color*=coatColorFromTexture.rgb;
#endif
coat_color*=uniforms.vCoatColorInfos.y;
#endif
#ifdef COAT_ROUGHNESS
coat_roughness*=coatRoughnessFromTexture.r;
#endif
#if defined(GEOMETRY_COAT_TANGENT) && defined(COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
coat_roughness_anisotropy*=geometryCoatTangentFromTexture.b;
#elif defined(COAT_ROUGHNESS_ANISOTROPY)
coat_roughness_anisotropy*=coatRoughnessAnisotropyFromTexture;
#endif
#ifdef COAT_DARKENING
coat_darkening*=coatDarkeningFromTexture.r;
#endif
#ifdef GEOMETRY_COAT_TANGENT
{let tangentFromTexture: vec2f=normalize(geometryCoatTangentFromTexture.xy*vec2f(2.0f)-vec2f(1.0f));let tangent_angle_texture: f32=atan2(tangentFromTexture.y,tangentFromTexture.x);let tangent_angle_uniform: f32=atan2(geometry_coat_tangent.y,geometry_coat_tangent.x);let tangent_angle: f32=tangent_angle_texture+tangent_angle_uniform;geometry_coat_tangent=vec2f(cos(tangent_angle),sin(tangent_angle));}
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
let coatAlpha: f32=coat_roughness*coat_roughness;let coatRoughnessT: f32=mix(coatAlpha,1.0f,coat_roughness_anisotropy*coat_roughness_anisotropy);let coatRoughnessB: f32=coatAlpha;coat_roughness_anisotropy=1.0f-coatRoughnessB/max(coatRoughnessT,0.00001f);coat_roughness=sqrt(coatRoughnessT/sqrt(2.0f/(1.0f+(1.0f-coat_roughness_anisotropy)*(1.0f-coat_roughness_anisotropy))));
#endif
`;e.IncludesShadersStoreWGSL[T]||(e.IncludesShadersStoreWGSL[T]=Ae)});var C;var Oe;var F=H(()=>{t();C=`openpbrEnvironmentLighting`,Oe=`#ifdef REFLECTION
var baseDiffuseEnvironmentLight: vec3f=sampleIrradiance(
normalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
let specularAlphaG: f32=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
var baseSpecularEnvironmentLight: vec3f=sampleRadianceAnisotropic(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,normalW);var baseSpecularEnvironmentLight: vec3f=sampleRadiance(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG *max(1.0f-baseGeoInfo.anisotropy,0.3f));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
var coatEnvironmentLight: vec3f=vec3f(0.f,0.f,0.f);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,coatNormalW);var coatAlphaG: f32=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
}
let dielectricIblFresnel: f32=getReflectanceFromBRDFWithEnvLookup(vec3f(baseDielectricReflectance.F0),vec3f(baseDielectricReflectance.F90),baseGeoInfo.environmentBrdf).r;let dielectricIblColoredFresnel: vec3f=getReflectanceFromBRDFWithEnvLookup(baseDielectricReflectance.coloredF0,baseDielectricReflectance.coloredF90,baseGeoInfo.environmentBrdf);let conductorIblFresnel: vec3f=conductorIblFresnel(baseConductorReflectance,baseGeoInfo.NdotV,specular_roughness,baseGeoInfo.environmentBrdf);var coatIblFresnel: f32=0.0;if (coat_weight>0.0) {coatIblFresnel=getReflectanceFromBRDFWithEnvLookup(vec3f(coatReflectance.F0),vec3f(coatReflectance.F90),coatGeoInfo.environmentBrdf).r;}
var slab_diffuse_ibl: vec3f=vec3f(0.,0.,0.);var slab_glossy_ibl: vec3f=vec3f(0.,0.,0.);var slab_metal_ibl: vec3f=vec3f(0.,0.,0.);var slab_coat_ibl: vec3f=vec3f(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*uniforms.vLightingIntensity.z;slab_diffuse_ibl*=aoOut.ambientOcclusionColor;slab_glossy_ibl=baseSpecularEnvironmentLight*uniforms.vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*uniforms.vLightingIntensity.z;var coatAbsorption=vec3f(1.0);if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*uniforms.vLightingIntensity.z;let hemisphere_avg_fresnel: f32=coatReflectance.F0+0.5f*(1.0f-coatReflectance.F0);var averageReflectance: f32=(coatIblFresnel+hemisphere_avg_fresnel)*0.5f;let roughnessFactor=1.0f-coat_roughness*0.5f;averageReflectance*=roughnessFactor;var darkened_transmission: f32=(1.0f-averageReflectance)*(1.0f-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior);let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let colored_transmission: vec3f=pow(coat_color,vec3f(coatPathLength));coatAbsorption=mix(vec3f(1.0f),colored_transmission*vec3f(darkened_transmission),coat_weight);}
var slab_subsurface_ibl: vec3f=vec3f(0.,0.,0.);var slab_translucent_base_ibl: vec3f=vec3f(0.,0.,0.);var slab_fuzz_ibl: vec3f=vec3f(0.,0.,0.);slab_diffuse_ibl*=base_color.rgb;
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
let material_opaque_base_ibl: vec3f=mix(slab_diffuse_ibl,slab_subsurface_ibl,subsurface_weight);let material_dielectric_base_ibl: vec3f=mix(material_opaque_base_ibl,slab_translucent_base_ibl,transmission_weight);let material_dielectric_gloss_ibl: vec3f=layer(material_dielectric_base_ibl,slab_glossy_ibl,dielectricIblFresnel,vec3f(1.0f),specular_color);let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3f(1.0f));material_surface_ibl=mix(material_coated_base_ibl,slab_fuzz_ibl,fuzz_weight);
#endif
`;e.IncludesShadersStoreWGSL[C]||(e.IncludesShadersStoreWGSL[C]=Oe)});var D;var Te;var M=H(()=>{t();D=`openpbrDirectLightingInit`,Te=`#ifdef LIGHT{X}
var preInfo{X}: preLightingInfo;var preInfoCoat{X}: preLightingInfo;let lightColor{X}: vec4f=light{X}.vLightDiffuse;var shadow{X}: f32=1.0f;
#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})
#else
#define CUSTOM_LIGHT{X}_COLOR 
#ifdef SPOTLIGHT{X}
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,vPositionW);
#elif defined(POINTLIGHT{X})
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,vPositionW);
#elif defined(HEMILIGHT{X})
preInfo{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(DIRLIGHT{X})
preInfo{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTSUPPORTED)
preInfo{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC2Sampler,viewDirectionW,normalW,vPositionW,light{X}.vLightData,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,specular_roughness);preInfoCoat{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC2Sampler,viewDirectionW,coatNormalW,vPositionW,light{X}.vLightData,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,coat_roughness);
#endif
preInfo{X}.NdotV=baseGeoInfo.NdotV;preInfoCoat{X}.NdotV=coatGeoInfo.NdotV;
#ifdef SPOTLIGHT{X}
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo{X}.attenuation=computeDistanceLightFalloff_GLTF(preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_GLTF(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Physical(preInfo{X}.lightDistanceSquared);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_Physical(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w);
#endif
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Standard(preInfo{X}.lightOffset,light{X}.vLightFalloff.x);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_Standard(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w,light{X}.vLightData.w);
#endif
#else
preInfo{X}.attenuation=computeDistanceLightFalloff(preInfo{X}.lightOffset,preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w,light{X}.vLightData.w,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#endif
#elif defined(POINTLIGHT{X})
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo{X}.attenuation=computeDistanceLightFalloff_GLTF(preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.y);
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Physical(preInfo{X}.lightDistanceSquared);
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Standard(preInfo{X}.lightOffset,light{X}.vLightFalloff.x);
#else
preInfo{X}.attenuation=computeDistanceLightFalloff(preInfo{X}.lightOffset,preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#endif
#else
preInfo{X}.attenuation=1.0f;
#endif
preInfoCoat{X}.attenuation=preInfo{X}.attenuation;
#if defined(HEMILIGHT{X}) || defined(AREALIGHT{X})
preInfo{X}.roughness=specular_roughness;preInfoCoat{X}.roughness=coat_roughness;
#else
preInfo{X}.roughness=adjustRoughnessFromLightProperties(specular_roughness,light{X}.vLightSpecular.a,preInfo{X}.lightDistance);preInfoCoat{X}.roughness=adjustRoughnessFromLightProperties(coat_roughness,light{X}.vLightSpecular.a,preInfoCoat{X}.lightDistance);
#endif
preInfo{X}.diffuseRoughness=base_diffuse_roughness;preInfo{X}.surfaceAlbedo=base_color.rgb;
#endif
#endif
`;e.IncludesShadersStoreWGSL[D]||(e.IncludesShadersStoreWGSL[D]=Te)});var G;var be;var P=H(()=>{t();G=`openpbrDirectLighting`,be=`#ifdef LIGHT{X}
{var slab_diffuse: vec3f=vec3f(0.f,0.f,0.f);var slab_subsurface: vec3f=vec3f(0.f,0.f,0.f);var slab_translucent: vec3f=vec3f(0.f,0.f,0.f);var slab_glossy: vec3f=vec3f(0.f,0.f,0.f);var specularFresnel: f32=0.0f;var slab_metal: vec3f=vec3f(0.f,0.f,0.f);var slab_coat: vec3f=vec3f(0.f,0.f,0.f);var coatFresnel: f32=0.0f;var slab_fuzz: vec3f=vec3f(0.f,0.f,0.f);
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X})
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},vPositionW);
#endif
numLights+=1.0f;
#if AREALIGHT{X}
slab_glossy=computeAreaSpecularLighting(preInfo{X},light{X}.vLightSpecular.rgb,baseConductorReflectance.F0,baseConductorReflectance.F90);
#else
{
#ifdef ANISOTROPIC_BASE
slab_glossy=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
0.0f,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,baseDielectricReflectance.coloredF0,baseDielectricReflectance.coloredF90,specular_roughness,lightColor{X}.rgb);
#endif
let NdotH: f32=dot(normalW,preInfo{X}.H);specularFresnel=fresnelSchlickGGX(NdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);}
#endif
#if AREALIGHT{X}
slab_metal=computeAreaSpecularLighting(preInfo{X},light{X}.vLightSpecular.rgb,baseConductorReflectance.F0,baseConductorReflectance.F90);
#else
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
let coloredFresnel: vec3f=specular_weight*getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
let coloredFresnel: vec3f=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,vec3f(baseConductorReflectance.coloredF0),coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if AREALIGHT{X}
slab_coat=computeAreaSpecularLighting(preInfoCoat{X},light{X}.vLightSpecular.rgb,coatReflectance.F0,coatReflectance.F90);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,0.0,
lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3f(coatReflectance.F0),vec3f(1.0f),coat_roughness,lightColor{X}.rgb);
#endif
let NdotH: f32=dot(coatNormalW,preInfoCoat{X}.H);coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
var coatAbsorption=vec3f(1.0f);if (coat_weight>0.0) {let cosTheta_view: f32=max(preInfoCoat{X}.NdotV,0.001f);let cosTheta_light: f32=max(preInfoCoat{X}.NdotL,0.001f);let fresnel_view: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_view,5.0);let fresnel_light: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_light,5.0);let averageReflectance: f32=(fresnel_view+fresnel_light)*0.5;var darkened_transmission: f32=(1.0f-averageReflectance)/(1.0f+averageReflectance);darkened_transmission=mix(1.0f,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior);let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let colored_transmission: vec3f=pow(coat_color,vec3f(coatPathLength));coatAbsorption=mix(vec3f(1.0f),colored_transmission*vec3f(darkened_transmission),coat_weight);}
slab_diffuse*=base_color.rgb;let material_opaque_base: vec3f=mix(slab_diffuse,slab_subsurface,subsurface_weight);let material_dielectric_base: vec3f=mix(material_opaque_base,slab_translucent,transmission_weight);let material_dielectric_gloss: vec3f=layer(material_dielectric_base,slab_glossy,specularFresnel,vec3f(1.0),specular_color);let material_base_substrate: vec3f=mix(material_dielectric_gloss,slab_metal,base_metalness);let material_coated_base: vec3f=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3f(1.0));material_surface_direct+=mix(material_coated_base,slab_fuzz,fuzz_weight);}
#endif
`;e.IncludesShadersStoreWGSL[G]||(e.IncludesShadersStoreWGSL[G]=be)});var o;var x;var aa;var Ce=H(()=>{t();i$3();S$1();m$1();D$1();f$1();i();n$2();r();a$1();s$2();n$1();A$1();n$4();R$1();i$2();s$3();o$1();I$1();T$1();n$3();c$2();_$1();B();l();s();c$3();d();u();_();S();E();s$1();F$1();N();L();O();b();h$1();F();M();P();a();c$1();y();H$1();l$1();W();o=`openpbrPixelShader`,x=`#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<openpbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<openpbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<openpbrNormalMapFragmentMainFunctions>
#include<openpbrNormalMapFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<openpbrDielectricReflectance>
#include<openpbrConductorReflectance>
#include<openpbrBlockAmbientOcclusion>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
fn layer(slab_bottom: vec3f,slab_top: vec3f,lerp_factor: f32,bottom_multiplier: vec3f,top_multiplier: vec3f)->vec3f {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
var coatNormalW: vec3f=normalW;
#include<openpbrNormalMapFragment>
#include<openpbrBlockNormalFinal>
#include<openpbrBaseLayerData>
#include<openpbrCoatLayerData>
var subsurface_weight: f32=0.0f;var transmission_weight: f32=0.0f;var fuzz_weight: f32=0.0f;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var aoOut: ambientOcclusionOutParams;
#ifdef AMBIENT_OCCLUSION
var ambientOcclusionFromTexture: vec3f=textureSample(ambientOcclusionSampler,ambientOcclusionSamplerSampler,fragmentInputs.vAmbientOcclusionUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT_OCCLUSION
ambientOcclusionFromTexture,
uniforms.vAmbientOcclusionInfos
#endif
);
#ifdef ANISOTROPIC_COAT
let coatGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3f(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
let coatGeoInfo: geometryInfoOutParams=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0f,pow(specular_roughness,4.0f)+2.0f*pow(coat_roughness,4.0f)),0.25f),coat_weight);
#ifdef ANISOTROPIC_BASE
let baseGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3f(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
let baseGeoInfo: geometryInfoOutParams=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
let coatReflectance: ReflectanceParams=dielectricReflectance(
coat_ior 
,1.0f 
,vec3f(1.0f)
,coat_weight
);let baseDielectricReflectance: ReflectanceParams=dielectricReflectance(
specular_ior 
,mix(1.0f,coat_ior,coat_weight) 
,specular_color
,specular_weight
);let baseConductorReflectance: ReflectanceParams=conductorReflectance(base_color,specular_color,specular_weight);var material_surface_ibl: vec3f=vec3f(0.f,0.f,0.f);
#include<openpbrEnvironmentLighting>
var material_surface_direct: vec3f=vec3f(0.f,0.f,0.f);
#if defined(LIGHT0)
var aggShadow: f32=0.f;var numLights: f32=0.f;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
var material_surface_emission: vec3f=uniforms.vEmissionColor;
#ifdef EMISSION_COLOR
let emissionColorTex: vec3f=textureSample(emissionColorSampler,emissionColorSamplerSampler,uniforms.vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpace(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= uniforms.vEmissionColorInfos.y;
#endif
material_surface_emission*=uniforms.vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
var finalColor: vec4f=vec4f(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,vec4f(0.0));
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<pbrBlockPrePass>
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
`;e.ShadersStoreWGSL[o]||(e.ShadersStoreWGSL[o]=x);aa={name:o,shader:x}});export{aa as n,Ce as t};