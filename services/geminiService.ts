import { GoogleGenAI, Modality } from "@google/genai";
import { RemodelingType, DecorStyle, Material, Lighting, CustomItem, RemodelMode, RoomType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  // Inpainting mode
  inpaintingPrompt?: string;
  maskBase64Data?: string;
}

function constructPrompt({
  remodelMode,
  roomType,
  remodelingType,
  decorStyle,
  materials,
  lighting,
  customItems,
  inpaintingPrompt,
}: Omit<RemodelOptions, 'base64ImageData' | 'mimeType' | 'maskBase64Data'>): string {
    const basePrompt = `
**PRIMARY OBJECTIVE:** Perform an interior redesign on the provided image while maintaining 100% fidelity to the original architectural structure.
**ROOM CONTEXT:** The user has identified this room as a "${roomType}". All design choices MUST be appropriate for this type of space.

**UNALTERABLE ELEMENTS (DO NOT CHANGE):**
- All existing walls, columns, beams.
- All existing windows and doors (position, size, shape).
- All existing ceilings, including any soffits, trays, or decorative moldings (like a ceiling rose).
- All existing floors, stairs, steps, and baseboards.
- The room's perspective, camera angle, and dimensions.
- The fundamental geometry of the space.

**FAILURE CONDITION:** Any modification, addition, or removal of the UNALTERABLE ELEMENTS listed above constitutes a complete failure. The model MUST NOT invent new architectural features like niches, openings, or windows. The output image's structure MUST overlay perfectly onto the original image's structure.

**ALLOWED MODIFICATIONS (YOUR TASK):**
You will perform an interior design transformation based on the following user request.`;

    let userRequest = '';

    if (remodelMode === 'inpainting') {
        userRequest = `
**TASK TYPE: In-painting / Targeted Edit**
- **Expert Role:** You are an expert photorealistic editor.
- **Inputs provided:** You have received an original image, a mask image, and a text prompt.
- **Core Instruction:** Your task is to perform an in-painting operation. You MUST modify the original image **ONLY** within the white areas defined by the mask image. The areas of the original image corresponding to the black areas of the mask MUST remain completely unchanged and preserved perfectly.
- **User's Goal:** The desired change is described in the following prompt.
- **User Prompt:** "${inpaintingPrompt}"
- **Architectural Constraint:** The UNALTERABLE ELEMENTS rule is still paramount. Do not add or remove structural elements like windows or doors, even if the mask covers that area. The goal is to change materials, objects, or surface appearances within the existing structure.
- **Realism:** Ensure the edit respects the original image's perspective, lighting, and shadows, blending seamlessly.
`;
    } else if (remodelMode === 'custom') {
        userRequest = `
**TASK TYPE: Custom Remodel**
- **Instruction:** Remodel the space using ONLY the user-provided images that follow this instruction.
- **Integration:** Realistically integrate these items into the room, following these specific rules:
  - 'Wall Material' items: Apply these as textures ONLY to wall surfaces.
  - 'Floor Material' items: Apply these as textures ONLY to floor surfaces.
  - 'Door' items: Replace the existing doors with these designs. The position, size, and frame of the doors MUST NOT be changed.
  - 'Window' items: Replace the existing windows with these designs. The position, size, and frame of the windows MUST NOT be changed.
  - 'Furniture' and 'Appliance' items: Place these logically within the room, respecting scale and perspective.
- **Lighting:** Adjust lighting to create a "${lighting}" atmosphere.
- **Constraint:** Do not add any other items, materials, or styles not provided by the user.
`;
    } else { // Style Mode
        if (remodelingType === RemodelingType.WithoutFurniture) {
            userRequest = `
**TASK TYPE: Style Remodel (Empty Room)**
- **Style:** Modern, clean, and high-quality.
- **Action:** Remodel the space to be completely empty. Remove all furniture and decorations.
- **Materials:**
  - Walls: ${materials!.wall}
  - Floor: ${materials!.floor}
  - Ceiling: ${materials!.ceiling}
- **Lighting:** Adjust lighting to create a "${lighting}" atmosphere.
`;
        } else { // With Furniture
            userRequest = `
**TASK TYPE: Style Remodel (With Furniture)**
- **Style:** "${decorStyle}"
- **Action:** Remodel the space by adding new furniture and decorative elements that align with the requested style.
- **CRITICAL CONSTRAINT:** You MUST NOT change the existing materials of the walls, floor, or ceiling. Preserve them as they are in the original image. Only add furniture and decor on top of the existing surfaces.
- **Lighting:** Adjust lighting to create a "${lighting}" atmosphere that enhances the "${decorStyle}" ambiance.
- **Constraint:** All added furniture must fit the real scale and perspective of the room.
`;
        }
    }

    const finalCheck = `
**FINAL CHECK:**
- Have any UNALTERABLE ELEMENTS been changed? (Correct answer: NO)
- Is the core structure identical to the original? (Correct answer: YES)
The output must be a photorealistic rendering that perfectly respects all constraints.`;

    return `${basePrompt}\n\n**USER REQUEST:**${userRequest}\n\n${finalCheck}`;
}


interface ContentPart {
  text?: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
}

export const remodelImage = async (options: RemodelOptions): Promise<string> => {
  const { base64ImageData, mimeType, customItems = [], remodelMode, maskBase64Data } = options;
  const prompt = constructPrompt(options);

  const parts: ContentPart[] = [
    {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    }
  ];

  if (remodelMode === 'inpainting' && maskBase64Data) {
    parts.push({
        inlineData: {
            data: maskBase64Data.split(',')[1],
            mimeType: 'image/png' // Mask is always PNG
        }
    });
  } else if (remodelMode === 'custom') {
    for (const item of customItems) {
      parts.push({
        inlineData: {
          data: item.dataUrl.split(',')[1],
          mimeType: item.mimeType
        }
      });
      parts.push({
        text: `This is a user-provided item. Category: ${item.category}. Name: "${item.name}". Use this in the remodeling according to the main prompt.`
      });
    }
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts,
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("API did not return an image.");
};