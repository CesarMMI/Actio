import {
  ICapturedItemRepository,
  IActionRepository,
  IProjectRepository,
  IContextRepository,
} from '../../src/domain/interfaces';

export function mockCapturedItemRepo(overrides: Partial<ICapturedItemRepository> = {}): jest.Mocked<ICapturedItemRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findByStatus: jest.fn(),
    ...overrides,
  } as jest.Mocked<ICapturedItemRepository>;
}

export function mockActionRepo(overrides: Partial<IActionRepository> = {}): jest.Mocked<IActionRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findByFilters: jest.fn(),
    countOpenByProjectId: jest.fn(),
    ...overrides,
  } as jest.Mocked<IActionRepository>;
}

export function mockProjectRepo(overrides: Partial<IProjectRepository> = {}): jest.Mocked<IProjectRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    ...overrides,
  } as jest.Mocked<IProjectRepository>;
}

export function mockContextRepo(overrides: Partial<IContextRepository> = {}): jest.Mocked<IContextRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    ...overrides,
  } as jest.Mocked<IContextRepository>;
}
