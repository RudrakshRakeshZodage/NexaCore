
import * as faceapi from '@vladmandic/face-api';

// Define the base path for models
export const FACE_API_MODEL_PATH = '/models/face-api';

// Create a flag to track if models have been loaded
let modelsLoaded = false;

// Function to load models
export const loadFaceApiModels = async (): Promise<boolean> => {
  if (modelsLoaded) return true;
  
  try {
    console.log('Loading face-api models from:', FACE_API_MODEL_PATH);
    
    // Load all required models
    await faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_MODEL_PATH);
    await faceapi.nets.faceExpressionNet.loadFromUri(FACE_API_MODEL_PATH);
    
    modelsLoaded = true;
    console.log('Face API models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw error;
  }
};

// Function to detect faces in an image
export const detectFaces = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
  // Ensure models are loaded before detection
  if (!modelsLoaded) {
    await loadFaceApiModels();
  }

  // Detect faces with all features
  const detections = await faceapi
    .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();
  
  return detections;
};

// Process expressions to wellness metrics
export const processExpressionsToWellnessMetrics = (expressions: faceapi.FaceExpressions) => {
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
