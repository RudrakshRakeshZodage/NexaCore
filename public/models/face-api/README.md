
# Face-API Models

This directory should contain the Face-API models required for facial expression analysis.

Download the following models from the official face-api.js repository and place them in this directory:

1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model-shard1`
3. `face_landmark_68_model-weights_manifest.json`
4. `face_landmark_68_model-shard1`
5. `face_recognition_model-weights_manifest.json`
6. `face_recognition_model-shard1`
7. `face_recognition_model-shard2`
8. `face_expression_model-weights_manifest.json`
9. `face_expression_model-shard1`

You can download these models from: https://github.com/vladmandic/face-api/tree/master/model

Or run the following command from project root to download them (requires curl):

```bash
curl -L https://github.com/vladmandic/face-api/archive/refs/heads/master.zip -o face-api.zip && \
unzip face-api.zip "face-api-master/model/*" && \
mkdir -p public/models/face-api && \
cp -r face-api-master/model/* public/models/face-api/ && \
rm -rf face-api-master face-api.zip
```
