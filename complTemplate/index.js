import { directives } from './directives/directives.js';
import { useEvents } from './useEvents.js';
import { useDynamicHtml } from './useDynamicHtml.js';
import { useDynamicsAttributes } from './useDynamicsAttributes.js';

export const compileTemplate = (template, script, vNames) => {
  [template, script] = useDynamicsAttributes(template,script,vNames);
  
  [template, script] = directives.refs(template, script, vNames);

 [template, script] = directives.conditions(template, script, vNames);
  
  [template, script] = useEvents(template, script);

 [template, script] = directives.models(template, script, vNames);
  
  [template, script] = directives.loops(template, script, vNames);
  
  [template, script] = useDynamicHtml(template, script, vNames);
  
  return [template, script]
}
