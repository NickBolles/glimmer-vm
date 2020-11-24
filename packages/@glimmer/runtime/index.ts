/**
 * @deprecated use RichIteratorResult<Tick, Return> or TemplateIterator instead
 */
import { RichIteratorResult } from '@glimmer/interfaces';
import './lib/bootstrap';

export { clear, ConcreteBounds, CursorImpl } from './lib/bounds';
export { Capability, capabilityFlagsFrom, hasCapability } from './lib/capabilities';
export {
  DebugCallback,
  resetDebuggerCallback,
  setDebuggerCallback,
} from './lib/compiled/opcodes/debugger';
export {
  CurriedComponentDefinition,
  curry,
  isCurriedComponentDefinition,
} from './lib/component/curried-component';
export {
  TemplateOnlyComponentManager,
  TemplateOnlyComponent,
  templateOnlyComponent,
} from './lib/component/template-only';
export {
  default as DOMChanges,
  DOMChangesImpl as IDOMChanges,
  DOMTreeConstruction,
  isWhitespace,
} from './lib/dom/helper';
export { normalizeProperty } from './lib/dom/props';
export { DynamicScopeImpl, PartialScopeImpl } from './lib/scope';
export {
  runtimeContext,
  EnvironmentImpl,
  EnvironmentDelegate,
  inTransaction,
} from './lib/environment';
export { default as getDynamicVar } from './lib/helpers/get-dynamic-var';
export { PublicModifierDefinition as ModifierDefinition } from './lib/modifier/interfaces';
export { RenderComponentArgs, renderComponent, renderMain, renderSync } from './lib/render';
export { SafeString } from './lib/upsert';
export { InternalVM, UpdatingVM, VM as LowLevelVM } from './lib/vm';
export {
  EMPTY_ARGS,
  EMPTY_NAMED,
  EMPTY_POSITIONAL,
  createCapturedArgs,
  reifyArgs,
  reifyNamed,
  reifyPositional,
} from './lib/vm/arguments';
export {
  DynamicAttribute,
  dynamicAttribute,
  SimpleDynamicAttribute,
} from './lib/vm/attributes/dynamic';
export {
  clientBuilder,
  NewElementBuilder,
  UpdatableBlockImpl,
  RemoteLiveBlock,
} from './lib/vm/element-builder';
export {
  isSerializationFirstNode,
  RehydrateBuilder,
  rehydrationBuilder,
  SERIALIZATION_FIRST_NODE_STRING,
} from './lib/vm/rehydrate-builder';
export {
  destroy,
  registerDestructor,
  unregisterDestructor,
  associateDestroyableChild,
  isDestroying,
  isDestroyed,
  enableDestroyableTracking,
  assertDestroyablesDestroyed,
  destroyChildren as _destroyChildren,
} from './lib/destroyables';
export { getOwner, setOwner, OWNER } from './lib/owner';

export type IteratorResult<T> = RichIteratorResult<null, T>;
