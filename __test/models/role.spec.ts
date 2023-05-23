import { GetAllRoles } from '../../src/models/role';
import { Role } from '../../src/types';

describe('Role model', () => {
    describe('GetAllRoles', () => {
        test('With 1 or more records in the table', async () => {
            const result: Array<Role> = await GetAllRoles();
            expect(result.length).toBeGreaterThan(0);
        });
    });
});

// export const main = () =>{

// };
