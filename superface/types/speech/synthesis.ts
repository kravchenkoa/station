import { typeHelper, TypedProfile } from '@superfaceai/one-sdk';
export type TextToSpeechSynthesisInput = {
    text: string;
    voice: {
        /** The language (and potentially also the region) of the voice expressed as a BCP-47 language tag, e.g. 'en-US'. **/
        languageCode: string;
        /** The name of the voice. **/
        name?: string;
    };
    audio: {
        /** The format of the audio byte stream. **/
        encoding: 'mp3' | 'linear_pcm';
        /** The synthesis sample rate (in hertz) for this audio. Selected sample rate has to be supported by selected audio encoding format. **/
        sampleRateHertz?: number;
    };
};
export type TextToSpeechSynthesisResult = {
    /**
     * Synthesised audio data bytes encoded as specified in the audio params input.
     * Base64 encoded.
     **/
    audioContent?: string;
};
const profile = {
    /** Text to speech synthesis usecase **/
    "TextToSpeechSynthesis": typeHelper<TextToSpeechSynthesisInput, TextToSpeechSynthesisResult>()
};
export type SpeechSynthesisProfile = TypedProfile<typeof profile>;
export const speechSynthesis = {
    "speech/synthesis": profile
};
