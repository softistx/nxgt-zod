import { z } from 'zod';

/** 1 to 2³¹ − 1: GraphQL's `Int` is 32 bits, so this is too. */
export const positiveIntSchema = z.int32().positive();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const positiveIntName = 'PositiveInt';
