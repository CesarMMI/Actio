import { ViewActionsUseCase } from '../../../src/application/use-cases/action/view-actions.use-case';
import { ActionStatus, TimeBucket, EnergyLevel } from '../../../src/domain/enums';
import { makeAction, mockActionRepo } from '../../helpers';

describe('UC-09 — View Actions (with filters)', () => {
  it('delegates to the repository with the supplied filters', async () => {
    const action = makeAction();
    const repo = mockActionRepo({ findByFilters: jest.fn().mockResolvedValue([action]) });
    const uc = new ViewActionsUseCase(repo);
    const filters = { timeBucket: TimeBucket.SHORT, energyLevel: EnergyLevel.LOW };

    const result = await uc.execute(filters);

    expect(repo.findByFilters).toHaveBeenCalledWith(filters);
    expect(result).toEqual([action]);
  });

  it('passes empty filters when none are provided', async () => {
    const repo = mockActionRepo({ findByFilters: jest.fn().mockResolvedValue([]) });
    const uc = new ViewActionsUseCase(repo);

    await uc.execute();

    expect(repo.findByFilters).toHaveBeenCalledWith({});
  });
});
