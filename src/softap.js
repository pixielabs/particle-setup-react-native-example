import { fetchJSON } from './utils';
import NodeRSA from 'node-rsa';

// Base URL for SoftAP.
const AP_URL = 'http://192.168.0.1:80';
// How long to wait when testing if we're connected to a SoftAP, in ms.
const PING_TIMEOUT = 500;

export const OPEN = 0;
export const WEP_PSK = 1;
export const WEP_SHARED = 32769;
export const WPA_AES_PSK = 2097156;
export const WPA_TKIP_PSK = 2097154;
export const WPA2_AES_PSK = 4194308;
export const WPA2_MIXED_PSK = 4194310;
export const WPA2_TKIP_PSK = 419430;

export default class Softap {
  static OPEN = 0
  static WEP_PSK = 1
  static WEP_SHARED = 32769
  static WPA_AES_PSK = 2097156
  static WPA_TKIP_PSK = 2097154
  static WPA2_AES_PSK = 4194308
  static WPA2_MIXED_PSK = 4194310
  static WPA2_TKIP_PSK = 419430

  // Public: Check if we're connected to a SoftAP setup network. Tries to
  // get a device-id. Short timeout on request for networks where the SoftAP
  // IP address conflicts with a normal network (why did they use such a 
  // common IP address?).
  //
  // Will resolve with a device ID, or reject if nothing is found.
  //
  // TODO: Cancel Fetch request if the watchdog wins the race, otherwise we
  // end up with a lot of requests floating around.
  static deviceId = () => {
    const responsePromise = fetchJSON(`${AP_URL}/device-id`).then((json) => {
      return json.id;     
    }).catch((err) => {
      throw 'no device';
    });

    const watchdogPromise = new Promise((res, rej) => {
      setTimeout(() => {rej('no device')}, 500)
    });

    // Whichever wins.
    return Promise.race([responsePromise, watchdogPromise]).then((id) => {
      return id;
    });
  }

  static scan = async () => {
    const { scans } = await fetchJSON(`${AP_URL}/scan-ap`);

    return scans;
  }

  static configure = async ({ssid, security, password}) => {
    const publicKey = await Softap.getPublicKey();
    const encryptedPassword = password ? publicKey.encrypt(password, 'hex') : '';

    // This endpoint returns no content
    await fetchJSON({
      body: {
        ch: 3,
        idx: 0,
        pwd: encryptedPassword,
        sec: security,
        'ssid-value': ssid,
      },
      method: 'POST',
      url: `${AP_URL}/configure-ap`,
    });

    // Now connect
    const { r: responseCode } = await fetchJSON({
      body: { idx: 0 },
      method: 'POST',
      url: `${AP_URL}/connect-ap`,
    });

    if (responseCode !== 0) {
      throw new Error('Failed to connect to wifi');
    }

  }

  static getPublicKey = async () => {
    const { b: rawDerPublicKey, r: responseCode } = await fetchJSON(
      `${AP_URL}/public-key`,
    );

    if (responseCode !== 0) {
      throw new Error('Error getting public key');
    }

    const derBuffer = Buffer.from(rawDerPublicKey, 'hex');

    const publicKey = new NodeRSA(derBuffer.slice(22), 'pkcs1-public-der', {
      encryptionScheme: 'pkcs1',
    });
    publicKey.importKey(derBuffer.slice(22), 'pkcs1-public-der');

    return publicKey;
  }

}
