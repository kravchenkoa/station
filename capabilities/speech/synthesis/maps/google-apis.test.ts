import { SuperfaceClient } from '../../../../superface/sdk';

describe('speech/synthesis/google-apis-typed', () => {
  it('should define use-case and provider', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('speech/synthesis');
    const provider = await client.getProvider('google-apis');
    const usecase = profile.useCases.TextToSpeechSynthesis;

    expect(provider).not.toBeUndefined();
    expect(usecase).not.toBeUndefined();
  });

  it('should synthetise text to speech in linear_pcm encoding', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('speech/synthesis');
    const provider = await client.getProvider('google-apis');

    // eslint-disable-next-line
    const result = await profile.useCases.TextToSpeechSynthesis.perform(
      {
        text: 'Hello world!',
        voice: { languageCode: 'en' },
        audio: { encoding: 'linear_pcm' },
      },
      {
        provider: provider,
      }
    );
    // eslint-disable-next-line
    expect(result.isOk()).toBeTruthy();
    // eslint-disable-next-line
    const value = result.unwrap();
    expect(value.audioContent).toBeDefined();
    expect(
      Buffer.from(value.audioContent ?? '', 'base64')
        .toString('ascii')
        .substring(0, 4)
    ).toBe('RIFF');
  });

  it('should return invalid argument error', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('speech/synthesis');
    const provider = await client.getProvider('google-apis');

    // eslint-disable-next-line
    const result = await profile.useCases.TextToSpeechSynthesis.perform(
      {
        text: 'Hello world!',
        voice: { languageCode: 'xx' },
        audio: { encoding: 'linear_pcm' },
      },
      {
        provider: provider,
      }
    );
    // eslint-disable-next-line
    expect(result.isErr()).toBeTruthy();
    try {
      // eslint-disable-next-line
      result.unwrap();
    } catch (error) {
      expect(error.properties.title).toBe('Invalid argument');
      expect(error.properties.detail).toBeDefined();
    }
  });
});
