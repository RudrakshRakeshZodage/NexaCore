
import * as faceapi from '@vladmandic/face-api';

// Define the base path for models
export const FACE_API_MODEL_PATH = '/models/face-api';

// Create a flag to track if models have been loaded
let modelsLoaded = false;

// Function to load models with improved error handling
export const loadFaceApiModels = async (): Promise<boolean> => {
  if (modelsLoaded) return true;
  
  try {
    console.log('Loading face-api models from:', FACE_API_MODEL_PATH);
    
    // Create a function to check if a file exists before trying to load it
    const checkFileExists = async (url: string): Promise<boolean> => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch (error) {
        return false;
      }
    };

    // Check if required files exist
    const tinyFaceDetectorManifestExists = await checkFileExists(`${FACE_API_MODEL_PATH}/tiny_face_detector_model-weights_manifest.json`);
    const faceLandmarkManifestExists = await checkFileExists(`${FACE_API_MODEL_PATH}/face_landmark_68_model-weights_manifest.json`);
    const faceRecognitionManifestExists = await checkFileExists(`${FACE_API_MODEL_PATH}/face_recognition_model-weights_manifest.json`);
    const faceExpressionManifestExists = await checkFileExists(`${FACE_API_MODEL_PATH}/face_expression_model-weights_manifest.json`);

    if (!tinyFaceDetectorManifestExists || !faceLandmarkManifestExists || 
        !faceRecognitionManifestExists || !faceExpressionManifestExists) {
      console.error('Face API model files are missing. Please download them according to the instructions in public/models/face-api/README.md');
      return false;
    }
    
    // Mock model loading - this allows the application to function without actual model files
    // In a production app, you would remove this mock and use the real model loading
    // This is just for demo purposes to avoid loading errors
    console.log('Models exist, proceeding with mock loading for demo purposes');
    modelsLoaded = true;
    return true;

    // Uncomment the below code when actual model files are available
    /*
    // Load all required models
    await faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_MODEL_PATH);
    await faceapi.nets.faceExpressionNet.loadFromUri(FACE_API_MODEL_PATH);
    
    modelsLoaded = true;
    console.log('Face API models loaded successfully');
    return true;
    */
  } catch (error) {
    console.error('Error loading face-api models:', error);
    return false;
  }
};

// Function to detect faces in an image (mock implementation for demo)
export const detectFaces = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
  // Ensure models are loaded before detection
  if (!modelsLoaded) {
    await loadFaceApiModels();
  }

  // For demo purposes, return mock detections
  // In a real app, you would uncomment the real detection code
  return [{
    detection: {
      box: {
        x: 50,
        y: 50,
        width: 200,
        height: 200
      }
    },
    landmarks: {
      positions: Array(68).fill({ x: 0, y: 0 })
    },
    expressions: {
      neutral: 0.2,
      happy: 0.6,
      sad: 0.05,
      angry: 0.03,
      fearful: 0.02,
      disgusted: 0.05,
      surprised: 0.05
    }
  }];

  // Real detection code, uncomment when models are available
  /*
  // Detect faces with all features
  const detections = await faceapi
    .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();
  
  return detections;
  */
};

// Define a type for facial expressions that matches what we use
export interface ExpressionMap {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
  [key: string]: number; // Allow for additional expressions
}

// Process expressions to wellness metrics
export const processExpressionsToWellnessMetrics = (expressions: ExpressionMap | faceapi.FaceExpressions) => {
  // Convert raw expressions to wellness metrics
  return {
    // Mental state metrics
    happiness: Math.min(expressions.happy * 1.5, 1) * 100,
    anxiety: (expressions.fearful + expressions.surprised * 0.5) * 100,
    stress: (expressions.angry * 0.7 + expressions.disgusted * 0.3) * 100,
    calmness: (1 - (expressions.angry + expressions.fearful + expressions.disgusted) / 3) * 100,
    
    // Wellness metrics
    fatigue: (expressions.sad * 0.6 + (1 - expressions.happy) * 0.4) * 100,
    energy: (expressions.happy * 0.7 + (1 - expressions.sad) * 0.3) * 100,
    focus: (1 - expressions.surprised * 0.8 - expressions.neutral * 0.2) * 100,
    motivation: (expressions.happy * 0.6 - expressions.sad * 0.4 + 0.5) * 100,
    relaxation: (1 - expressions.angry - expressions.disgusted) * 100,
    concentration: (1 - (expressions.surprised + expressions.neutral) / 2) * 100,
    sleepQuality: (1 - expressions.sad * 0.8 - expressions.neutral * 0.2) * 100,
    mood: (expressions.happy - expressions.sad + 1) * 50,
  };
};
