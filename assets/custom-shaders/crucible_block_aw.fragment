// __multiversion__
// This signals the loading code to prepend either #version 100 or #version 300 es as apropriate.
precision highp float;

#include "fragmentVersionCentroidUV.h"
#include "uniformEntityConstants.h"
#include "uniformShaderConstants.h"
#include "util.h"

LAYOUT_BINDING(0) uniform sampler2D TEXTURE_0;

uniform float R;
uniform float G;
uniform float B;

void main()
{
 vec4 tex = texture2D(TEXTURE_0, uv);
 gl_FragColor.a = 0.6;
 gl_FragColor.r = (tex.r/2.0) + (R/3.0);
 gl_FragColor.g = (tex.g/2.0) + (G/3.0);
 gl_FragColor.b = (tex.b/2.0) + (B/3.0);
}
