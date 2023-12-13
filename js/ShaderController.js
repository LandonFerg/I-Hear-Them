function SetDitherColor(_r, _g, _b)
{
    ditherShader.uniforms.mainR.value = _r;
    ditherShader.uniforms.mainG.value = _g;
    ditherShader.uniforms.mainB.value = _b;
}
