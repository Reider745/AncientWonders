// __multiversion__
// This signals the loading code to prepend either #version 100 or #version 300 es as apropriate.
precision highp float;

#include "fragmentVersionCentroidUV.h"
#include "uniformEntityConstants.h"

#include "uniformShaderConstants.h"
#include "util.h"

LAYOUT_BINDING(0) uniform sampler2D TEXTURE_0;

uniform highp float TIME;
float PI = 3.14159265;

void main() {
	vec4 result = texture2D(TEXTURE_0, uv);
	float timeSin = sin(TIME) * 0.5 + 0.5;
	float timeSin2 = sin(TIME + PI / 2.0) * 0.5 + 0.5;
	float timeSin3 = sin(TIME + PI)  * 0.5 + 0.5;
	result.r = timeSin;
	result.g = timeSin2;
	result.b = timeSin3;
	gl_FragColor = result;
}
