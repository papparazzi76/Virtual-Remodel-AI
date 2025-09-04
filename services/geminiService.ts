
import { GoogleGenAI, Modality, Part } from '@google/genai';
import { 
  RemodelingType, DecorStyle, Material, Lighting, CustomItem, 
  RemodelMode, RoomType, TilingPattern, AnchorPoint, EdgeHandling, TargetSurface, 
  MaterialFinish, TargetWall 
} from '../types';

interface MaterialSelections {
  wall: Material;
  floor: Material;
  ceiling: Material;
}

// The API key MUST be provided via the `process.env.API_KEY` environment variable.
// This is a security best practice and prevents exposing sensitive keys in client-side code.
const API_KEY = "AIzaSyAtAqU1yRTAHFS2_IXZGKUrfKpxlL4zwxs";

if (!API_KEY) {
  // This error is intentional and helps developers realize the API key is missing.
  // In a real-world scenario, you'd want to handle this more gracefully.
  // For this project, we'll throw an error to make it obvious.
  throw new Error("API_KEY environment variable not set. Please ensure it is configured in your environment's secrets.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

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
  // Material mode
  targetSurface?: TargetSurface;
  materialFinish?: MaterialFinish;
  targetWall?: TargetWall;
  materialTexture?: string | null;
  materialMimeType?: string | null;
  pieceWidthCm?: number;
  pieceHeightCm?: number;
  groutThicknessMm?: number;
  groutColorHex?: string;
  tilingPattern?: TilingPattern;
  tilingOffsetPercent?: number;
  pieceOrientation?: number;
  anchorPoint?: AnchorPoint;
  edgeHandling?: EdgeHandling;
}

const getLightingPrompt = (lighting: Lighting): string => {
    switch (lighting) {
        case 'Night Time':
            return "The lighting must be clearly nighttime. All light must come from artificial interior sources like lamps or ceiling lights. Any windows must show darkness outside. This is a critical instruction.";
        case 'Golden Hour':
            return "The lighting should be warm, soft, and low, characteristic of the golden hour just before sunset, creating long, soft shadows.";
        case 'Studio Light':
            return "The lighting should be bright, even, and professional, as if the room was shot in a photography studio. Minimize harsh shadows.";
        case 'Overcast':
            return "The lighting should be soft, diffused, and cool, as if it's a cloudy or overcast day outside. Shadows should be very soft or non-existent.";
        case 'Bright & Airy':
            return "The lighting should be bright, natural, and airy, with plenty of daylight flooding the space.";
        case 'Warm & Cozy':
            return "The lighting should be warm and inviting, likely from indoor light sources, creating a cozy and comfortable atmosphere.";
        case 'Cool & Modern':
            return "The lighting should have a cool, modern feel, perhaps with a slight blueish tint, clean and crisp.";
        case 'Dramatic & Dim':
            return "The lighting should be dim and dramatic, with high contrast, creating focused pools of light and deep shadows.";
        default:
            return `The lighting style should be ${lighting}.`;
    }
};

const getBasePrompt = (roomType: RoomType, lighting: Lighting): string => {
    const lightingInstruction = getLightingPrompt(lighting);
    return `You are an expert virtual staging AI specializing in photorealistic interior design. Your primary goal is to modify a room based on user specifications while strictly adhering to realism and preserving the original structure.

**CRITICAL RULES:**
1.  **Preserve Architecture:** You MUST NOT alter the room's fundamental structure. Walls, windows, doors, ceiling, and their positions must remain identical to the original image. Do not add or remove structural elements.
2.  **Maintain Perspective:** The camera angle, perspective, and proportions of the room MUST be perfectly preserved.
3.  **Ensure Photorealism:** The final image must be indistinguishable from a real photograph. Pay close attention to textures, reflections, and how light interacts with surfaces.
4.  **Lighting Integrity:** The overall lighting of the scene must be consistent. ${lightingInstruction}
5.  **Occlusion:** New elements must be correctly occluded by existing objects, and vice-versa.

The user wants to remodel a **${roomType}**.
`;
}

export const remodelImage = async (options: RemodelOptions): Promise<string> => {
  try {
    let prompt = getBasePrompt(options.roomType, options.lighting);
    
    const imagePart = {
      inlineData: {
        mimeType: options.mimeType,
        data: options.base64ImageData,
      },
    };

    const parts: Part[] = [{text: ""}, imagePart];

    switch(options.remodelMode) {
      case 'style':
        if (options.remodelingType === RemodelingType.WithFurniture) {
          prompt += `
Apply a complete redesign in a **${options.decorStyle}** style. This includes changing furniture, decor, wall colors, and floor materials to fit the new style. The result should be a fully furnished and decorated, cohesive space.`;
        } else { // Without Furniture
          prompt += `
Remove all furniture and decor, leaving the room completely empty. Then, apply new materials to the surfaces:
- Walls: ${options.materials?.wall}
- Floor: ${options.materials?.floor}
- Ceiling: ${options.materials?.ceiling}`;
        }
        break;
      
      case 'custom':
        prompt += `The user has provided a custom prompt and may have included specific items to add to the scene. Follow these instructions precisely: "${options.customPrompt}".\n`;
        if (options.customItems && options.customItems.length > 0) {
           prompt += `Incorporate the following items into the scene, paying close attention to their specified category:\n`;
           options.customItems.forEach(item => {
              prompt += `- A ${item.category} with the appearance of the provided '${item.name}' image.\n`;
              parts.push({ inlineData: { mimeType: item.mimeType, data: item.dataUrl.split(',')[1] } });
           });
        }
        break;

      case 'inpainting':
        prompt += `This is an in-painting task. The user has provided a mask indicating an area to modify. ONLY change what is inside the masked area (the white part of the mask image). The user's instruction for this change is: "${options.inpaintingPrompt}". All other parts of the image must remain absolutely unchanged.`;
        if (options.maskBase64Data) {
            parts.push({ inlineData: { mimeType: 'image/png', data: options.maskBase64Data.split(',')[1] } });
        }
        break;
      
      case 'material':
        const targetDescription = options.targetSurface === 'Floor'
          ? 'the Floor'
          : `the **${options.targetWall === 'all' ? 'walls' : `${options.targetWall} wall`}**`;

        const finishDescription = options.materialFinish === 'glossy'
            ? "The material must have a **glossy, reflective finish**. It should realistically reflect light sources and other elements in the room."
            : "The material must have a **matte, non-reflective finish**. It should appear flat and absorb light without creating sharp highlights.";

        prompt += `Your main task is to apply a new material to **${targetDescription}** in the room.

**Material Application Details:**
*   **Material Finish:** ${finishDescription}
*   **Material Texture:** An image of a single piece of the material is provided. Use this as the texture.
*   **Piece Dimensions:** Each piece is exactly ${options.pieceWidthCm} cm wide and ${options.pieceHeightCm} cm high. It is absolutely critical to render the pieces at this scale relative to the room's proportions. Do not just stretch a single texture; it must be a repeating pattern of individual pieces.
*   **Tiling Pattern:** Arrange the pieces in a "${options.tilingPattern}" pattern.
`;
        if (options.tilingPattern === 'brick_custom') {
            prompt += ` The rows should be offset by ${options.tilingOffsetPercent}%.`;
        } else if (options.tilingPattern === 'brick_50') {
            prompt += ` The rows should be offset by 50%.`;
        }
        prompt += `
*   **Grout:** The gap between pieces must be ${options.groutThicknessMm}mm wide and have the hex color ${options.groutColorHex}.
*   **Orientation:** The pieces must be rotated by ${options.pieceOrientation} degrees.
*   **Anchor Point:** The tiling pattern should originate from the ${options.anchorPoint} of the surface.
*   **Edges:** ${options.edgeHandling === 'clip' ? 'Pieces at the edges of the surface should be cut off cleanly.' : 'Allow partial pieces to be visible at the edges.'}

Apply this transformation with extreme photorealism. For example, if the user asks for a '10x20cm subway tile in a 50% brick pattern', you must render many small, rectangular tiles, not one large texture.
`;
        if (options.materialTexture && options.materialMimeType) {
            parts.push({ inlineData: { mimeType: options.materialMimeType, data: options.materialTexture.split(',')[1] } });
        }
        break;
    }

    parts[0] = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: parts,
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const imageResponsePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imageResponsePart && imageResponsePart.inlineData) {
        return imageResponsePart.inlineData.data;
    } else {
      console.error("Gemini API response did not contain an image part:", response);
      const textResponse = response.text?.trim() ?? "No text response.";
      throw new Error(`The AI failed to generate an image. Reason: ${textResponse}`);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    throw new Error(`Failed to generate remodel. Please check the console for details. Error: ${errorMessage}`);
  }
};