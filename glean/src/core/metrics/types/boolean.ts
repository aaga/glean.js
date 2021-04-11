/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { MetricType, CommonMetricData } from "../index.js";
import Glean from "../../glean.js";
import { BooleanMetric } from "./boolean_metric.js";

/**
 *  A boolean metric.
 *
 * Records a simple flag.
 */
class BooleanMetricType extends MetricType {
  constructor(meta: CommonMetricData) {
    super("boolean", meta);
  }

  /**
   * Sets to the specified boolean value.
   *
   * @param value the value to set.
   */
  set(value: boolean): void {
    Glean.dispatcher.launch(async () => {
      if (!this.shouldRecord(Glean.isUploadEnabled())) {
        return;
      }

      const metric = new BooleanMetric(value);
      await Glean.metricsDatabase.record(this, metric);
    });
  }

  /**
   * **Test-only API**
   *
   * Gets the currently stored value as a boolean.
   *
   * This doesn't clear the stored value.
   *
   * TODO: Only allow this function to be called on test mode (depends on Bug 1682771).
   *
   * @param ping the ping from which we want to retrieve this metrics value from.
   *        Defaults to the first value in `sendInPings`.
   *
   * @returns The value found in storage or `undefined` if nothing was found.
   */
  async testGetValue(ping: string = this.sendInPings[0]): Promise<boolean | undefined> {
    let metric: boolean | undefined;
    await Glean.dispatcher.testLaunch(async () => {
      metric = await Glean.metricsDatabase.getMetric<boolean>(ping, this);
    });
    return metric;
  }
}

export default BooleanMetricType;
