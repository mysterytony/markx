/**
 * This file contain all and only the data types that are used
 * across the project. Don't define any top level function or
 * top level function calls in this module.
 * @module Domain
 */

/** @class */
export class Term {
  /**
   * takes a string as the term's state name
   * @param {String} termName
   */
  constructor(termName) {
    this.termName = termName;
  }
}

/** @class */
export class Terminal extends Term {
  /**
   * @param {String} termName
   */
  constructor(termName) {
    super(termName);
  }

  /**
   * @method
   * @param {String} termName
   * @return {Boolean}
   */
  equals(termName) {
    return termName === this.termName;
  }
}

/** @class */
export class NonTerminal extends Term {
  /**
   * @param {String} termName
   */
  constructor(termName) {
    super(termName)
  }
}

/** @class */
export class Token {
  /**
   * 
   * @param {Term} term 
   * @param {string} lex 
   */
  constructor(term, lex) {
    this.term = term;
    this.lex = lex;
  }
}

/** @class */
export class Transition {
  /**
   * @param {Term} from
   * @param {Term[]} to
   * @param {string[]} lookAheadTokens
   */
  constructor(from, to = [], lookAheadTokens = []) {
    this.from = from;
    this.to = to;
    this.lookAheadTokens = lookAheadTokens;
  }

  /**
   * @method
   * @return {string[]}
   */
  getTransitionExpressions() {
    var exps = [];
    exps.push(this.from);
    to.forEach(s => {
      exps.push(s);
    });
    return exps;
  }
}

/**
 * @typedef Pair
 * @property {Number} first
 * @property {String} second
 */

/**
 * @typedef RuleType
 * @property {Number} reduce
 * @property {Number} shift
 */

/**
 * @readonly
 * @enum {Number}
 */
export const RuleType = {
  reduce: 0,
  shift: 1
};

/** @class */
export class Rule {
  /**
   * @constructor
   * @param {Number} fromStateId
   * @param {String} token
   * @param {RuleType} action one of 'reduce' or 'shift' of RuleType enum
   * @param {Number} num represent the transition to reduce or next state to shift
   */
  constructor(fromStateId, token, action, num) {
    this.fromStateId = fromStateId;
    this.token = token;
    /** @type {RuleType} */
    this.action = action;
    this.num = num;
  }

  /**
   * copy the rule r
   * @static
   * @method
   * @param {Rule} r
   * @return {Rule}
   */
  static copyRule(r) {
    return new Rule(r.state, r.token, r.action, r.num);
  }
}

/** @class */
export class IntermediateTransition {
  /**
   * @param {Transition} transition
   * @param {number} position
   * @param {Term} next
   */
  constructor(transition, position, next) {
    this.transition = transition;
    this.position = position;
    this.next = next;
  }
}

/** @class */
export class State {
  /**
   * 
   * @param {number} id 
   * @param {IntermediateTransition[]} intermediateTransitions 
   * @param {Rule[]} rules 
   */
  constructor(id, intermediateTransitions = [], rules = []) {
    this.id = id;
    this.rules = rules;
    this.intermediateTransitions = intermediateTransitions;
  }
}
