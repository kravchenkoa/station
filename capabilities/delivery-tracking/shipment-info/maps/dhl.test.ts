import { SuperfaceClient } from '../../../../superface/sdk';

describe('delivery-tracking/shipment-info/dhl', () => {
  it('should define use-case and provider', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('delivery-tracking/shipment-info');
    const useCase = profile.getUseCase('ShipmentInfo');
    const provider = await client.getProvider('dhl');

    expect(useCase).not.toBeUndefined();
    expect(provider).not.toBeUndefined();
  });

  describe('valid tracking number', () => {
    let shipment: any;
    beforeAll(async () => {
      const client = new SuperfaceClient();
      const profile = await client.getProfile(
        'delivery-tracking/shipment-info'
      );
      const dhl = await client.getProvider('dhl');
      const result = await profile.useCases.ShipmentInfo.perform(
        { trackingNumber: '00340434292135100131' },
        { provider: dhl }
      );
      shipment = result.unwrap()[0];
    });
    it('should return valid tracking number', () => {
      expect(shipment.trackingNumber).toBe('00340434292135100131');
    });
    it('should return valid origin location', () => {
      expect(shipment.origin).toEqual({
        address: {
          countryCode: 'DE',
        },
      });
    });
    it('should return valid destination location', () => {
      expect(shipment.destination).toEqual({
        address: {
          countryCode: 'DE',
        },
      });
    });
    it('should return valid status', () => {
      expect(shipment.status.statusCode).toEqual('pre_transit');
      expect(shipment.status.statusText).toEqual(
        'The instruction data for this shipment have been provided by the sender to DHL electronically'
      );
      expect(shipment.status.timestamp).toBeDefined();
    });
    it('should return events', () => {
      expect(shipment.events.length).toBe(1);
    });
  });

  it('should return error for not existing tracking number', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('delivery-tracking/shipment-info');
    const dhl = await client.getProvider('dhl');
    const result = await profile.useCases.ShipmentInfo.perform(
      { trackingNumber: 'NOT_EXISTING_TRACKING_NUMBER' },
      { provider: dhl }
    );
    expect(result.isErr()).toBeTruthy();
  });
});
