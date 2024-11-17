import { expect, it } from 'vitest';
import { date2RFC1123, date2RFC3339 } from './date';

const date = new Date(2024, 11, 17, 22, 20, 0);

it('date2RFC1123', () => expect(date2RFC1123(date)).contains('Tue, 17 Dec 2024 14:20:00'));

it('date2RFC3339', () => expect(date2RFC3339(date)).contains('2024-12-17T14:20:00'));
