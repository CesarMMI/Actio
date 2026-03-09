import { CreateContextUseCase } from '../../../src/application/use-cases/context/create-context.use-case';
import { mockContextRepo } from '../../helpers';

describe('UC-18 — Create a Context', () => {
  it('creates a context with active: true', async () => {
    const repo = mockContextRepo();
    const uc = new CreateContextUseCase(repo);

    const context = await uc.execute({ name: '@computer' });

    expect(context.name).toBe('@computer');
    expect(context.active).toBe(true);
    expect(context.id).toBeDefined();
    expect(repo.save).toHaveBeenCalledWith(context);
  });

  it('persists optional description', async () => {
    const repo = mockContextRepo();
    const uc = new CreateContextUseCase(repo);

    const context = await uc.execute({ name: '@errands', description: 'Outside tasks' });

    expect(context.description).toBe('Outside tasks');
  });
});
