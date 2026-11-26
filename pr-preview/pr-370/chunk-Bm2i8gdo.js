import{a as H}from"./chunk-DBRZyZM1.js";import{n as t$1,t as e}from"./chunk-B_VM99PE.js";var c;var a;var t;var n=H(()=>{t$1();c=`circleOfConfusionPixelShader`,a=`uniform sampler2D depthSampler;varying vec2 vUV;
#ifndef COC_DEPTH_NOT_NORMALIZED
uniform vec2 cameraMinMaxZ;
#endif
uniform float focusDistance;uniform float cocPrecalculation;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float depth=texture2D(depthSampler,vUV).r;
#define CUSTOM_COC_DEPTH
#ifdef COC_DEPTH_NOT_NORMALIZED
float pixelDistance=depth*1000.0;
#else
float pixelDistance=(cameraMinMaxZ.x+cameraMinMaxZ.y*depth)*1000.0; 
#endif
#define CUSTOM_COC_PIXELDISTANCE
float coc=abs(cocPrecalculation*((focusDistance-pixelDistance)/pixelDistance));coc=clamp(coc,0.0,1.0);gl_FragColor=vec4(coc,coc,coc,1.0);}
`;e.ShadersStore[c]||(e.ShadersStore[c]=a);t={name:c,shader:a}});export{t as n,n as t};