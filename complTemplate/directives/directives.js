import {useConditions} from './useConditions.js'
import {useLoops} from './useLoops.js';
import {useModels} from './useModels.js';
import {useRefs} from './useRefs.js'

export const directives = {
  conditions: useConditions,
  loops: useLoops,
  models: useModels,
  refs: useRefs
}
