//* package imports
import { FilterQuery, Model } from 'mongoose';

type ProjectionObj<T> = Partial<Record<keyof T | string, 0 | 1>>;

/**
 * Fetch documents from any Mongoose model, with optional filtering and projection.
 *
 * @param model  - A Mongoose Model (e.g. UserModel, ProposalModel, etc)
 * @param where? - A FilterQuery<T> object; if omitted, returns all docs
 * @param fields? - Array of field names to include; if omitted, returns all fields
 *
 * @returns Promise resolving to an array of documents (lean objects)
 */
export async function fetchData<
    T,
    K extends keyof T = keyof T
>(
    model: Model<T>,
    where?: FilterQuery<T>,
    fields?: readonly K[] | ProjectionObj<T>
): Promise<Pick<T, K>[]> {
    let query = model.find(where ?? {});

    if (fields) {
        if (Array.isArray(fields)) {
            query = query.select(fields.join(' '));
        } else {
            query = query.select(fields as Record<string, 0 | 1>);
        }
    }

    return query.lean<Pick<T, K>[]>().exec();
}

/* 
1. If you call fetchData(UserModel) without specifying fields, then K defaults to keyof T (i.e. every field), so you get back Pick<T, keyof T>[]—which is just T[].

2. If you call fetchData(UserModel, { isActive: true }, ['email', 'name']), then TypeScript infers K = 'email' | 'name', and the return type becomes Pick<T, 'email' | 'name'>[]—an array of objects containing only those two properties.
*/
