import { z } from 'zod';
import { noNegativeZero } from '../../rules/integer';

/** A TCP or UDP port number, 0 to 65535. */
export const portSchema = noNegativeZero(z.int().min(0).max(65535));

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const portName = 'Port';
