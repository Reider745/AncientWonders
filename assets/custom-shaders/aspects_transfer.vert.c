// __multiversion__
// This signals the loading code to prepend either #version 100 or #version 300 es as apropriate.

#include "vertexVersionSimple.h"
#include "uniformWorldConstants.h"
#include "vertexVersionCentroidUV.h"

_centroid out float timeout;
//out vec2 size;

attribute mediump vec4 POSITION;
attribute vec2 TEXCOORD_0;
uniform highp float TIME;

//varying vec4 color;

void main(){
    gl_Position = WORLDVIEWPROJ * POSITION;
    POS4 worldPos = WORLD * POSITION;
    
    float time = TIME * 3.0;
    
		gl_Position.y += sin(time + worldPos.xz) * .03;
		gl_Position.x += cos(time + worldPos.x) * .001;
		gl_Position.z += sin(time + worldPos.z) * .001;
		
  	uv = TEXCOORD_0;
    timeout = TIME;
}