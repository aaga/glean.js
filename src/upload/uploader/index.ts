/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { UploadResult, UploadResultStatus } from "upload";

/**
 * Uploader interface, actualy uploading logic varies per platform.
 */
export abstract class Uploader {
  // The timeout, in seconds, to use for all operations with the server.
  protected defaultTimeout = 10_000;

  /**
   * Makes a POST request to a given url, with the given headers and body.
   *
   * @param url The URL to make the POST request
   * @param body The stringified body of this post request
   * @param headers Optional header to include in the request
   *
   * @returns The status code of the response.
   */
  abstract post(url: string, body: string, headers?: Record<string, string>): Promise<UploadResult>;
}

// Default export for tests sake.
//
// This is necessary, because when building for release we will not use this index file.
// Instead, each platform should have their own Uploader implementation and alias the "upload/adapter"
// import to point to the their specific file.
//
// The aliasing is done in the webpack configuration, but tests don't use webpack and expect
// this file to have a default export.
//
// TODO: remove this comment once Bug 1687516 is resolved.
class MockUploader extends Uploader {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  post(_url: string, _body: string, _headers?: Record<string, string>): Promise<UploadResult> {
    const result: UploadResult = {
      result: UploadResultStatus.Success,
      status: 200
    };
    return Promise.resolve(result);
  }
}

export default new MockUploader();
