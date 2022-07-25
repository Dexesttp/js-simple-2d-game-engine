/** @typedef {string} AudioSampleId */

/**
 * @param {never} type
 * @param {string} item_name
 * @returns {never}
 */
function assertTypeIsHandled(type, item_name) {
  throw new Error(`Unexpected type ${type} for ${item_name}`);
}

/**
 * @param {import("./types").AudioAssets} audio_assets The sound snippets available in-game
 */
export function AudioEngine(audio_assets) {
  this.audio_assets = audio_assets;
  this.context = new window.AudioContext();
  this.music_gain = this.context.createGain();
  this.music_gain.gain.value = 1.0;
  this.effect_gain = this.context.createGain();
  this.effect_gain.gain.value = 1.0;
  /** @type {Record<AudioSampleId, { audio: HTMLMediaElement, gain: GainNode, track: MediaElementAudioSourceNode }> } */
  this.registered_tracks = {};

  for (const asset_id in audio_assets.snippets) {
    const asset = audio_assets.snippets[asset_id];
    if (this.registered_tracks[asset_id]) throw new Error(`Cannot register the audio asset ${asset_id} twice`);
    const track = this.context.createMediaElementSource(asset.media);
    const gain = this.context.createGain();
    let connected_node = track.connect(gain);
    if (asset.kind === 'music') connected_node = connected_node.connect(this.music_gain);
    else if (asset.kind === 'effect') connected_node = connected_node.connect(this.effect_gain);
    connected_node.connect(this.context.destination);
    gain.gain.value = 0.0;
    this.registered_tracks[asset_id] = { audio: asset.media, gain: gain, track: track };
  }
}

/**
 * @param {import("./types").AudioAssetKind} kind
 * @param {number} value
 */
AudioEngine.prototype.set_volume = function (kind, value) {
  if (kind === 'effect') {
    this.effect_gain.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
    return;
  }
  if (kind === 'music') {
    this.music_gain.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
    return;
  }
  assertTypeIsHandled(kind, 'Audio track kind');
};

/**
 * @param {AudioSampleId} identifier
 */
AudioEngine.prototype.start_loop = function (identifier) {
  const data = this.registered_tracks[identifier];
  if (!data) throw new Error(`Cannot enable audio for unknown identifier ${identifier}`);
  if (data.audio.paused) {
    try {
      data.audio.loop = true;
      data.audio.currentTime = 0;
      data.audio.play();
    } catch (e) {}
  }
};

/**
 * @param {AudioSampleId} identifier
 */
AudioEngine.prototype.stop_loop = function (identifier) {
  const data = this.registered_tracks[identifier];
  if (!data) throw new Error(`Cannot enable audio for unknown identifier ${identifier}`);
  if (!data.audio.paused) {
    try {
      data.audio.pause();
    } catch (e) {}
  }
};

/**
 * @param {AudioSampleId} identifier
 */
AudioEngine.prototype.loop_disable = function (identifier) {
  const data = this.registered_tracks[identifier];
  if (!data) throw new Error(`Cannot enable audio for unknown identifier ${identifier}`);
  try {
    data.gain.gain.setTargetAtTime(0.0, this.context.currentTime, 0.2);
  } catch (e) {}
};

/**
 * @param {AudioSampleId} identifier
 */
AudioEngine.prototype.loop_enable = function (identifier) {
  const data = this.registered_tracks[identifier];
  if (!data) throw new Error(`Cannot enable audio for unknown identifier ${identifier}`);
  try {
    data.gain.gain.setTargetAtTime(1.0, this.context.currentTime, 0.2);
  } catch (e) {}
};

/**
 * @param {AudioSampleId} identifier
 */
AudioEngine.prototype.play_once = function (identifier) {
  const data = this.registered_tracks[identifier];
  if (!data) throw new Error(`Cannot enable audio for unknown identifier ${identifier}`);
  try {
    data.gain.gain.value = 1.0;
    data.audio.loop = false;
    data.audio.currentTime = 0;
    data.audio.play();
  } catch (e) {}
};

AudioEngine.prototype.stop_all = function () {
  for (const sample_id in this.registered_tracks) {
    try {
      this.registered_tracks[sample_id].audio.pause();
    } catch (e) {}
  }
};
