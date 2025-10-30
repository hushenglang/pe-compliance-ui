declare module 'opencc-js' {
  export type ConversionType = 'cn' | 'tw' | 'twp' | 'hk' | 'jp' | 't';
  
  export interface ConverterOptions {
    from: ConversionType;
    to: ConversionType;
  }
  
  export function Converter(options: ConverterOptions): (text: string) => string;
}

