/// API module
import { IApi } from './interface';
import { RemoteApi } from './remote-api';
import { RemoteCdn } from './remote-cdn';

/** API factory */
export class ApiFactory {
  /**
   * Create API from remote API
   *
   * @param apiUrl API Url
   * @returns API interface
   */
  public static fromRemoteApi(apiUrl: string): IApi {
    return new RemoteApi(apiUrl);
  }

  /**
   * Create API from remote CDN
   *
   * @param cdnUrl CDN Url
   * @returns API interface
   */
  public static fromRemoteCdn(cdnUrl: string): IApi {
    return new RemoteCdn(cdnUrl);
  }
}
