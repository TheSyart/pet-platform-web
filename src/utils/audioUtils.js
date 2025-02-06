async function fetchPCMData(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

 function convertPCMToWAV(buffer, sampleRate, numChannels, bitDepth) {
  const dataLength = buffer.byteLength;
  const view = new DataView(new ArrayBuffer(44 + dataLength));

  // WAV header
  writeString(view, 0, 'RIFF'); // RIFF identifier
  view.setUint32(4, 36 + dataLength, true); // file length - 8
  writeString(view, 8, 'WAVE'); // RIFF type
  writeString(view, 12, 'fmt '); // format chunk identifier
  view.setUint32(16, 16, true); // format chunk length
  view.setUint16(20, 1, true); // audio format (1 = PCM)
  view.setUint16(22, numChannels, true); // number of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // byte rate
  view.setUint16(32, numChannels * (bitDepth / 8), true); // block align
  view.setUint16(34, bitDepth, true); // bits per sample
  writeString(view, 36, 'data'); // data chunk identifier
  view.setUint32(40, dataLength, true); // data chunk length

  // PCM data
  const samples = new Int16Array(buffer);
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(44 + i * 2, samples[i], true);
  }

  return view.buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export async function playPCMFromUrl(url, sampleRate, bitDepth, numChannels) {
  const pcmBuffer = await fetchPCMData(url);
  const wavBuffer = convertPCMToWAV(pcmBuffer, sampleRate, numChannels, bitDepth);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(blob);

  const audio = new Audio(audioUrl);
  audio.play();
}