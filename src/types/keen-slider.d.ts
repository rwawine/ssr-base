declare module 'keen-slider/react' {
  import { RefObject } from 'react';
  import { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';

  export function useKeenSlider<T = HTMLElement>(
    options?: KeenSliderOptions,
    plugins?: Array<(slider: KeenSliderInstance) => void>
  ): [RefObject<T>, RefObject<KeenSliderInstance>];
}

declare module 'keen-slider' {
  export interface KeenSliderOptions {
    loop?: boolean;
    mode?: 'free' | 'free-snap' | 'snap';
    slides?: {
      perView?: number;
      spacing?: number;
    };
    created?: (slider: KeenSliderInstance) => void;
    slideChanged?: (slider: KeenSliderInstance) => void;
    [key: string]: any;
  }

  export interface KeenSliderInstance {
    container: HTMLElement;
    track: {
      details: {
        rel: number;
      };
    };
    next: () => void;
    prev: () => void;
    moveToIdx: (index: number) => void;
    on: (event: string, callback: (slider: KeenSliderInstance) => void) => void;
    [key: string]: any;
  }
} 