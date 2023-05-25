import { signIn } from '../../src/models/user';

describe('User model', () => {
    describe('signIn', () => {
        test('When the user is not found', async () => {
            const userToSign = {
                user_name: 'obladiOblada',
                pwd: '123'
            };
            const result = await signIn(userToSign);

            expect(result.success).toBe(false);
            // eslint-disable-next-line quotes
            expect(result.message).toBe("The given username doesn't exists in our database");
        });

        test('When the given password is wrong', async () => {
            const userToSign = {
                user_name: 'bramirez',
                pwd: '456'
            };

            const result = await signIn(userToSign);
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('The given password is incorrect');
        });

        test('When the signIn is possible', async () => {
            const userToSign = {
                user_name: 'bramirez',
                pwd: '123'
            };

            const result = await signIn(userToSign);
            
            expect(result.success).toBe(true);
        });
    });
});