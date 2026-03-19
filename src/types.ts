/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Video {
  id: string;
  title: string;
  description: string;
  city: string;
  time: 'morning' | 'day' | 'night';
}
