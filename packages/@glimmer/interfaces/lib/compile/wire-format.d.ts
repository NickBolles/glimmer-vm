import { PresentArray } from '../array';
import { Dict, Option } from '../core';

export type TupleSyntax = Statement | TupleExpression;

type JsonValue = string | number | boolean | JsonObject | JsonArray;

interface JsonObject extends Dict<JsonValue> {}
interface JsonArray extends Array<JsonValue> {}

export type TemplateReference = Option<SerializedBlock>;
export type YieldTo = number;

/**
 * A VariableResolutionContext explains how a variable name should be resolved.
 */
export const enum VariableResolutionContext {
  Strict = 0,
  AmbiguousAppend = 1,
  AmbiguousAppendInvoke = 2,
  AmbiguousAttr = 3,
  LooseFreeVariable = 4,
  ResolveAsCallHead = 5,
  ResolveAsModifierHead = 6,
  ResolveAsComponentHead = 7,
}

export const enum SexpOpcodes {
  // Statements
  Append = 1,
  TrustingAppend = 2,
  Comment = 3,
  Modifier = 4,
  StrictModifier = 5,
  Block = 6,
  StrictBlock = 7,
  Component = 8,

  OpenElement = 10,
  OpenElementWithSplat = 11,
  FlushElement = 12,
  CloseElement = 13,
  StaticAttr = 14,
  DynamicAttr = 15,
  ComponentAttr = 16,

  AttrSplat = 17,
  Yield = 18,
  Partial = 19,

  DynamicArg = 20,
  StaticArg = 21,
  TrustingDynamicAttr = 22,
  TrustingComponentAttr = 23,
  StaticComponentAttr = 24,

  Debugger = 26,

  // Expressions
  HasBlock = 27,
  HasBlockParams = 28,
  Undefined = 29,
  Call = 30,
  Concat = 31,

  // Get
  GetSymbol = 32, // GetPath + 0-2,
  GetStrictFree = 33,

  // falls back to `this.` (or locals in the case of partials), but
  // never turns into a component or helper invocation
  GetFreeAsFallback = 34,
  // `{{x}}` in append position (might be a helper or component invocation, otherwise fall back to `this`)
  GetFreeAsComponentOrHelperHeadOrThisFallback = 35,
  // a component or helper (`{{<expr> x}}` in append position)
  GetFreeAsComponentOrHelperHead = 36,
  // a helper or `this` fallback `attr={{x}}`
  GetFreeAsHelperHeadOrThisFallback = 37,
  // a call head `(x)`
  GetFreeAsHelperHead = 38,
  GetFreeAsModifierHead = 39,
  GetFreeAsComponentHead = 40,

  // InElement
  InElement = 41,

  GetStart = GetSymbol,
  GetEnd = GetFreeAsComponentHead,
  GetLooseFreeStart = GetFreeAsComponentOrHelperHeadOrThisFallback,
  GetLooseFreeEnd = GetFreeAsComponentHead,
  GetContextualFreeStart = GetFreeAsComponentOrHelperHeadOrThisFallback,
}

export type GetContextualFreeOp =
  | SexpOpcodes.GetFreeAsComponentOrHelperHeadOrThisFallback
  | SexpOpcodes.GetFreeAsComponentOrHelperHead
  | SexpOpcodes.GetFreeAsHelperHeadOrThisFallback
  | SexpOpcodes.GetFreeAsHelperHead
  | SexpOpcodes.GetFreeAsModifierHead
  | SexpOpcodes.GetFreeAsComponentHead
  | SexpOpcodes.GetFreeAsFallback
  | SexpOpcodes.GetStrictFree;

export type AttrOp =
  | SexpOpcodes.StaticAttr
  | SexpOpcodes.StaticComponentAttr
  | SexpOpcodes.DynamicAttr
  | SexpOpcodes.TrustingDynamicAttr
  | SexpOpcodes.ComponentAttr
  | SexpOpcodes.TrustingComponentAttr;

export type StatementSexpOpcode = Statement[0];
export type StatementSexpOpcodeMap = {
  [TSexpOpcode in Statement[0]]: Extract<Statement, { 0: TSexpOpcode }>;
};
export type ExpressionSexpOpcode = TupleExpression[0];
export type ExpressionSexpOpcodeMap = {
  [TSexpOpcode in TupleExpression[0]]: Extract<TupleExpression, { 0: TSexpOpcode }>;
};

export interface SexpOpcodeMap extends ExpressionSexpOpcodeMap, StatementSexpOpcodeMap {}
export type SexpOpcode = keyof SexpOpcodeMap;

export namespace Core {
  export type Expression = Expressions.Expression;

  export type CallArgs = [Params, Hash];
  export type Path = [string, ...string[]];
  export type ConcatParams = PresentArray<Expression>;
  export type Params = Option<ConcatParams>;
  export type Hash = Option<[PresentArray<string>, PresentArray<Expression>]>;
  export type Blocks = Option<[string[], SerializedInlineBlock[]]>;
  export type Args = [Params, Hash];
  export type NamedBlock = [string, SerializedInlineBlock];
  export type EvalInfo = number[];
  export type ElementParameters = Option<PresentArray<ElementParameter>>;

  export type Syntax = Path | Params | ConcatParams | Hash | Blocks | Args | EvalInfo;
}

export type CoreSyntax = Core.Syntax;

export namespace Expressions {
  export type Path = Core.Path;
  export type Params = Core.Params;
  export type Hash = Core.Hash;

  export type GetSymbol = [SexpOpcodes.GetSymbol, number];
  export type GetStrictFree = [SexpOpcodes.GetStrictFree, number];
  export type GetFreeAsFallback = [SexpOpcodes.GetFreeAsFallback, number];
  export type GetFreeAsComponentOrHelperHeadOrThisFallback = [
    SexpOpcodes.GetFreeAsComponentOrHelperHeadOrThisFallback,
    number
  ];
  export type GetFreeAsComponentOrHelperHead = [SexpOpcodes.GetFreeAsComponentOrHelperHead, number];
  export type GetFreeAsHelperHeadOrThisFallback = [
    SexpOpcodes.GetFreeAsHelperHeadOrThisFallback,
    number
  ];
  export type GetFreeAsHelperHead = [SexpOpcodes.GetFreeAsHelperHead, number];
  export type GetFreeAsModifierHead = [SexpOpcodes.GetFreeAsModifierHead, number];
  export type GetFreeAsComponentHead = [SexpOpcodes.GetFreeAsComponentHead, number];

  export type GetContextualFree =
    | GetFreeAsFallback
    | GetFreeAsComponentOrHelperHeadOrThisFallback
    | GetFreeAsComponentOrHelperHead
    | GetFreeAsHelperHeadOrThisFallback
    | GetFreeAsHelperHead
    | GetFreeAsModifierHead
    | GetFreeAsComponentHead;
  export type GetVar = GetSymbol | GetStrictFree | GetContextualFree;

  export type GetPathSymbol = [SexpOpcodes.GetSymbol, number, Path];
  export type GetPathStrictFree = [SexpOpcodes.GetStrictFree, number, Path];
  export type GetPathFreeAsFallback = [SexpOpcodes.GetFreeAsFallback, number, Path];
  export type GetPathFreeAsComponentOrHelperHeadOrThisFallback = [
    SexpOpcodes.GetFreeAsComponentOrHelperHeadOrThisFallback,
    number,
    Path
  ];
  export type GetPathFreeAsComponentOrHelperHead = [
    SexpOpcodes.GetFreeAsComponentOrHelperHead,
    number,
    Path
  ];
  export type GetPathFreeAsHelperHeadOrThisFallback = [
    SexpOpcodes.GetFreeAsHelperHeadOrThisFallback,
    number,
    Path
  ];
  export type GetPathFreeAsHelperHead = [SexpOpcodes.GetFreeAsHelperHead, number, Path];
  export type GetPathFreeAsModifierHead = [SexpOpcodes.GetFreeAsModifierHead, number, Path];
  export type GetPathFreeAsComponentHead = [SexpOpcodes.GetFreeAsComponentHead, number, Path];

  export type GetPathContextualFree =
    | GetPathFreeAsFallback
    | GetPathFreeAsComponentOrHelperHeadOrThisFallback
    | GetPathFreeAsComponentOrHelperHead
    | GetPathFreeAsHelperHeadOrThisFallback
    | GetPathFreeAsHelperHead
    | GetPathFreeAsModifierHead
    | GetPathFreeAsComponentHead;
  export type GetPath = GetPathSymbol | GetPathStrictFree | GetPathContextualFree;

  export type Get = GetVar | GetPath;

  export type StringValue = string;
  export type NumberValue = number;
  export type BooleanValue = boolean;
  export type NullValue = null;
  export type Value = StringValue | NumberValue | BooleanValue | NullValue;
  export type Undefined = [SexpOpcodes.Undefined];

  export type TupleExpression = Get | Concat | HasBlock | HasBlockParams | Helper | Undefined;

  // TODO get rid of undefined, which is just here to allow trailing undefined in attrs
  // it would be better to handle that as an over-the-wire encoding concern
  export type Expression = TupleExpression | Value | undefined;

  export type Concat = [SexpOpcodes.Concat, Core.ConcatParams];
  export type Helper = [SexpOpcodes.Call, Expression, Option<Params>, Hash];
  export type HasBlock = [SexpOpcodes.HasBlock, Expression];
  export type HasBlockParams = [SexpOpcodes.HasBlockParams, Expression];
}

export type Expression = Expressions.Expression;
export type Get = Expressions.GetVar;

export type TupleExpression = Expressions.TupleExpression;

export const enum WellKnownAttrName {
  class = 0,
  id = 1,
  value = 2,
  name = 3,
  type = 4,
  style = 5,
  href = 6,
}

export const enum WellKnownTagName {
  div = 0,
  span = 1,
  p = 2,
  a = 3,
}

export namespace Statements {
  export type Expression = Expressions.Expression | undefined;
  export type Params = Core.Params;
  export type Hash = Core.Hash;
  export type Blocks = Core.Blocks;
  export type Path = Core.Path;

  export type Append = [SexpOpcodes.Append, Expression];
  export type TrustingAppend = [SexpOpcodes.TrustingAppend, Expression];
  export type Comment = [SexpOpcodes.Comment, string];
  export type Modifier = [SexpOpcodes.Modifier, Expression, Params, Hash];
  export type Block = [SexpOpcodes.Block, Expression, Option<Params>, Hash, Blocks];
  export type Component = [
    op: SexpOpcodes.Component,
    tag: Expression,
    parameters: Core.ElementParameters,
    args: Hash,
    blocks: Blocks
  ];
  export type OpenElement = [SexpOpcodes.OpenElement, string | WellKnownTagName];
  export type OpenElementWithSplat = [SexpOpcodes.OpenElementWithSplat, string | WellKnownTagName];
  export type FlushElement = [SexpOpcodes.FlushElement];
  export type CloseElement = [SexpOpcodes.CloseElement];
  export type StaticAttr = [
    SexpOpcodes.StaticAttr,
    string | WellKnownAttrName,
    Expression,
    string?
  ];
  export type StaticComponentAttr = [
    SexpOpcodes.StaticComponentAttr,
    string | WellKnownAttrName,
    Expression,
    string?
  ];

  export type AnyStaticAttr = StaticAttr | StaticComponentAttr;

  export type AttrSplat = [SexpOpcodes.AttrSplat, YieldTo];
  export type Yield = [SexpOpcodes.Yield, YieldTo, Option<Params>];
  export type Partial = [SexpOpcodes.Partial, Expression, Core.EvalInfo];
  export type DynamicArg = [SexpOpcodes.DynamicArg, string, Expression];
  export type StaticArg = [SexpOpcodes.StaticArg, string, Expression];

  export type DynamicAttr = [
    SexpOpcodes.DynamicAttr,
    string | WellKnownAttrName,
    Expression,
    string?
  ];
  export type ComponentAttr = [
    SexpOpcodes.ComponentAttr,
    string | WellKnownAttrName,
    Expression,
    string?
  ];
  export type TrustingDynamicAttr = [
    SexpOpcodes.TrustingDynamicAttr,
    string | WellKnownAttrName,
    Expression,
    string?
  ];
  export type TrustingComponentAttr = [
    SexpOpcodes.TrustingComponentAttr,
    string | WellKnownAttrName,
    Expression,
    string?
  ];

  export type AnyDynamicAttr =
    | DynamicAttr
    | ComponentAttr
    | TrustingDynamicAttr
    | TrustingComponentAttr;

  export type Debugger = [SexpOpcodes.Debugger, Core.EvalInfo];
  export type InElement = [
    op: SexpOpcodes.InElement,
    block: SerializedInlineBlock,
    guid: string,
    destination: Expression,
    insertBefore?: Expression
  ];

  /**
   * A Handlebars statement
   */
  export type Statement =
    | Append
    | TrustingAppend
    | Comment
    | Modifier
    | Block
    | Component
    | OpenElement
    | OpenElementWithSplat
    | FlushElement
    | CloseElement
    | Attribute
    | AttrSplat
    | Yield
    | Partial
    | StaticArg
    | DynamicArg
    | Debugger
    | InElement;

  export type Attribute =
    | StaticAttr
    | StaticComponentAttr
    | DynamicAttr
    | TrustingDynamicAttr
    | ComponentAttr
    | TrustingComponentAttr;

  export type ComponentFeature = Modifier | AttrSplat;
  export type Argument = StaticArg | DynamicArg;

  export type ElementParameter = Attribute | Argument | ComponentFeature;
}

/** A Handlebars statement */
export type Statement = Statements.Statement;
export type Attribute = Statements.Attribute;
export type Argument = Statements.Argument;
export type ElementParameter = Statements.ElementParameter;

export type SexpSyntax = Statement | TupleExpression;
// TODO this undefined is related to the other TODO in this file
export type Syntax = SexpSyntax | Expressions.Value | undefined;

export type SyntaxWithInternal =
  | Syntax
  | CoreSyntax
  | SerializedTemplateBlock
  | Core.CallArgs
  | Core.NamedBlock
  | Core.ElementParameters;

/**
 * A JSON object that the Block was serialized into.
 */
export type SerializedBlock = [Statements.Statement[]];

export type SerializedInlineBlock = [
  // statements
  Statements.Statement[],
  // params
  number[]
];

/**
 * A JSON object that the compiled TemplateBlock was serialized into.
 */
export type SerializedTemplateBlock = [
  // statements
  Statements.Statement[],
  // symbols
  string[],
  // hasEval
  boolean,
  // upvars
  string[]
];

/**
 * A JSON object that the compiled Template was serialized into.
 */
export interface SerializedTemplate {
  block: SerializedTemplateBlock;
  id?: Option<string>;
  moduleName: string;
}

/**
 * A string of JSON containing a SerializedTemplateBlock
 */
export type SerializedTemplateBlockJSON = string;

/**
 * A JSON object containing the SerializedTemplateBlock as JSON and TemplateMeta.
 */
export interface SerializedTemplateWithLazyBlock {
  id?: Option<string>;
  block: SerializedTemplateBlockJSON;
  moduleName: string;
}

/**
 * A string of Javascript containing a SerializedTemplateWithLazyBlock to be
 * concatenated into a Javascript module.
 */
export type TemplateJavascript = string;
