import { z } from 'zod';

/**
 * A latitude in decimal degrees, a finite number from -90 to 90: `48.8566`,
 * not `48°51'N`. Conventionally on WGS 84, as GeoJSON and most APIs use; the
 * datum is not checked. `-0` is taken, as by the other float scalars.
 */
export const latitudeSchema = z.number().min(-90).max(90);

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const latitudeName = 'Latitude';
