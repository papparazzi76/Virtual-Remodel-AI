
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { RemodelingType, DecorStyle, Material, Lighting, CustomItem, RemodelMode, RoomType } from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

interface MaterialSelections {
  wall: Material;
  floor: Material;
  ceiling: Material;
}

interface RemodelOptions {
  base64ImageData: string;
  mimeType: string;
  roomType: RoomType;
  lighting: Lighting;
  remodelMode: RemodelMode;
  // Style mode
  remodelingType?: RemodelingType;
  decorStyle?: DecorStyle;
  materials?: MaterialSelections;
  // Custom mode
  customItems?: CustomItem[];
  customPrompt?: string;
  // Inpainting mode
  inpaintingPrompt?: string;
  maskBase64Data?: string;
}

const constructPrompt = (options: RemodelOptions): string => {
    let prompt = `As an expert AI interior designer, perform a photorealistic virtual remodel of the provided room image. CRITICAL: You must preserve the original room's architecture, including windows, doors, ceiling structure, and overall layout. Only alter the style, materials, and furniture as specified. The room is a ${options.roomType}.`;

    switch (options.remodelMode) {
        case 'style':
            prompt += ` The lighting should be ${options.lighting}.`;
            if (options.remodelingType === RemodelingType.WithFurniture) {
                prompt += ` Please remodel it in a '${options.decorStyle}' decor style.`;
            } else { // WithoutFurniture
                prompt += ` Please remodel it as an empty room with the following materials: Walls: ${options.materials?.wall}, Floor: ${options.materials?.floor}, Ceiling: ${options.materials?.ceiling}.`;
            }
            break;

        case 'custom':
            // This prompt is extremely strict to prevent the AI from making unwanted creative changes.
            // It frames the AI as a photo editor, not a designer.
            prompt = `You are acting as an expert photo editor, not an interior designer. Your ONLY task is to make precise modifications to the provided image based on the user's instructions. The room is a ${options.roomType}. The lighting should be ${options.lighting}.
            - CRITICAL: Preserve the original room's architecture, including windows, doors, ceiling structure, and overall layout perfectly.
            - DO NOT apply any creative styles or change the overall aesthetic.
            - DO NOT add, remove, or alter ANY furniture, decorations, or elements unless explicitly told to do so by the user.
            - Your function is strictly to execute specific commands, such as applying a provided material to a surface, or adding a specific piece of furniture.
            - All unmentioned parts of the room must remain IDENTICAL to the original image.`;

            const hasFurnitureOrAppliances = options.customItems?.some(
                item => item.category === 'Furniture' || item.category === 'Appliance'
            );

            if (hasFurnitureOrAppliances) {
                prompt += `\n\nSPECIAL INSTRUCTIONS FOR FURNITURE/APPLIANCES: When integrating furniture or appliances from provided images, you MUST place them realistically. It is essential to maintain correct scale, proportion, perspective, and lighting so they blend seamlessly into the room.`;
            }
            
            prompt += `\n\nStick strictly to the user's request.`;
            
            if (options.customPrompt) {
                prompt += ` User's instructions are: "${options.customPrompt}".`;
            }
            if (options.customItems && options.customItems.length > 0) {
                prompt += ` The user has also provided the following items as images to be incorporated according to the instructions.`;
            }
            break;
            
        case 'inpainting':
            // For inpainting, the prompt is more about direct editing
            return `You are an expert photo editor. Edit the masked area of the image according to this instruction: "${options.inpaintingPrompt}". The changes should be photorealistic and seamlessly blended with the rest of the image.`;
    }

    return prompt;
};


export const remodelImage = async (options: RemodelOptions): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image-preview';
    const textPrompt = constructPrompt(options);

    const parts: Part[] = [
      { inlineData: { mimeType: options.mimeType, data: options.base64ImageData } },
    ];
    
    // For inpainting, the mask comes second
    if (options.remodelMode === 'inpainting' && options.maskBase64Data) {
        parts.push({
            inlineData: {
                mimeType: 'image/png',
                data: options.maskBase64Data.split(',')[1],
            }
        });
    }

    // Prompt text always comes after the main images
    parts.push({ text: textPrompt });

    // For custom mode, add any extra item images at the end
    if (options.remodelMode === 'custom' && options.customItems) {
        for (const item of options.customItems) {
            parts.push({
                inlineData: {
                    mimeType: item.mimeType,
                    data: item.dataUrl.split(',')[1],
                }
            });
        }
    }

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return part.inlineData.data;
      }
    }

    throw new Error("AI did not return an image.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Re-throw the error so the calling component (MainApp.tsx) can handle it.
    throw error;
  }
};