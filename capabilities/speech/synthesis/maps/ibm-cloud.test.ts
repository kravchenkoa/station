import { SuperfaceClient } from '../../../../superface/sdk';

describe('speech/synthesis/ibm-cloud-typed', () => {
  it('should define use-case and provider', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('speech/synthesis');
    const provider = await client.getProvider('ibm-cloud');
    const usecase = profile.useCases.TextToSpeechSynthesis;

    expect(provider).not.toBeUndefined();
    expect(usecase).not.toBeUndefined();
  });

  it('should synthetise text to speech ecoded to linear_pcm', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('speech/synthesis');
    const provider = await client.getProvider('ibm-cloud');

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

  it('should synthetise text to speech encoded to mp3', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('speech/synthesis');
    const provider = await client.getProvider('ibm-cloud');

    // eslint-disable-next-line
    const result = await profile.useCases.TextToSpeechSynthesis.perform(
      {
        text: 'Hello world!',
        voice: { languageCode: 'en' },
        audio: { encoding: 'mp3' },
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
    expect(Buffer.from(value.audioContent ?? '', 'base64')).toBeDefined();
  });
});
