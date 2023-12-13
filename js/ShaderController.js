function SetDitherColor(_r, _g, _b)
{
    ditherShader.uniforms.mainR.value = _r;
    ditherShader.uniforms.mainG.value = _g;
    ditherShader.uniforms.mainB.value = _b;
}

function LerpVignetteIn(_dt, _targetStrength) {
    // Ensure vignetteStrength uniform is defined
    if (vignetteShader && vignetteShader.uniforms && vignetteShader.uniforms.vignetteStrength) {
        let currentStrength = vignetteShader.uniforms.vignetteStrength.value;
        let lerpRate = 0.2; // Adjust this rate to control the speed of interpolation

        // Direct implementation of linear interpolation
        let lerpValue = currentStrength + (lerpRate * _dt * (_targetStrength - currentStrength));

        // Clamp the value to ensure it doesn't exceed the range you intend (e.g., 0 to 1)
        vignetteShader.uniforms.vignetteStrength.value = Math.min(Math.max(lerpValue, 0), 1);
    } else {
        console.error("vignetteShader or vignetteStrength uniform is not defined.");
    }
}

function LerpVignetteOut(_dt, _targetStrength) {
    // Ensure vignetteStrength uniform is defined
    if (vignetteShader && vignetteShader.uniforms && vignetteShader.uniforms.vignetteStrength) {
        let currentStrength = vignetteShader.uniforms.vignetteStrength.value;
        let lerpRate = 0.9; // Adjust this rate to control the speed of interpolation

        // Direct implementation of linear interpolation
        let lerpValue = currentStrength + (lerpRate * _dt * (_targetStrength - currentStrength));

        // Clamp the value to ensure it doesn't exceed the range you intend (e.g., 0 to 1)
        vignetteShader.uniforms.vignetteStrength.value = Math.min(Math.max(lerpValue, 0), 1);
    } else {
        console.error("vignetteShader or vignetteStrength uniform is not defined.");
    }
}
