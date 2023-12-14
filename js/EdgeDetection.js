THREE.EdgeDetectionShader = {
    uniforms: {
        "tDiffuse": { value: null }, // Rendered scene texture
        "resolution": { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        "edgeThreshold": { value: 0.05 }
    },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float edgeThreshold;
        varying vec2 vUv;

        // Sobel operator
        float sobel() {
            vec2 texel = 1.0 / resolution;
            float Gx = 0.0;
            float Gy = 0.0;

            mat3 G[2];
            G[0] = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1); // Kernel for horizontal gradient
            G[1] = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1); // Kernel for vertical gradient

            for(int i = -1; i <= 1; i++) {
                for(int j = -1; j <= 1; j++) {
                    vec4 sample = texture2D(tDiffuse, vUv + vec2(i, j) * texel);
                    float sampleIntensity = (sample.r + sample.g + sample.b) / 3.0;
                    Gx += G[0][i + 1][j + 1] * sampleIntensity;
                    Gy += G[1][i + 1][j + 1] * sampleIntensity;
                }
            }

            float edge = sqrt(Gx * Gx + Gy * Gy); // Magnitude of the gradient
            return edge;
        }

        void main() {
            float edge = sobel();

            vec4 originalColor = texture2D(tDiffuse, vUv); // Get original scene color

            if(edge > edgeThreshold) {
                // Blend the edge color with the original color
                gl_FragColor = mix(originalColor, vec4(1.0, 1.0, 1.0, 1.0), 0.8); // Change 0.5 to adjust blending
            } else {
                gl_FragColor = originalColor; // Keep original scene
            }
        }
    `
};