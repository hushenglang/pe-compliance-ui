import { Converter } from 'opencc-js';

/**
 * Converts Traditional Chinese text to Simplified Chinese
 * @param text The text to convert
 * @returns The converted simplified Chinese text
 */
export const convertToSimplifiedChinese = (text: string): string => {
  try {
    // Create a converter from Traditional Chinese (Hong Kong) to Simplified Chinese
    const converter = Converter({ from: 'hk', to: 'cn' });
    return converter(text);
  } catch (error) {
    console.error('Error converting Chinese text:', error);
    return text; // Return original text if conversion fails
  }
};

/**
 * Converts Simplified Chinese text to Traditional Chinese
 * @param text The text to convert
 * @returns The converted traditional Chinese text
 */
export const convertToTraditionalChinese = (text: string): string => {
  try {
    // Create a converter from Simplified Chinese to Traditional Chinese (Hong Kong)
    const converter = Converter({ from: 'cn', to: 'hk' });
    return converter(text);
  } catch (error) {
    console.error('Error converting Chinese text:', error);
    return text; // Return original text if conversion fails
  }
};

