import { Game } from './engine.mjs';

export type ControllerSystemMethod<EntityDataType> = (game: Game<EntityDataType>, elapsedTicks: number) => void;
export type SystemMethod<EntityDataType> = (game: Game<EntityDataType>) => void;

export type ImageAssetPartialInformation = {
  origin: { x: number; y: number; w: number; h: number };
  target: { w: number; h: number };
};

export type AudioAssetKind = 'music' | 'effect';

export type AudioAssetPartialInformation = {
  name: string;
  kind: AudioAssetKind;
};

export type AudioAssets = {
  snippets: {
    [id: string]: {
      kind: AudioAssetKind;
      media: HTMLAudioElement;
    };
  };
};

export type GameData<EntityDataType> = {
  entities: EntityDataType[];
};
