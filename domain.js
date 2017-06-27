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
   * @param {String} s
   */
  constructor(s) {
    this.state = s;
  }
}

/** @class */
export class Terminal extends Term {
  /**
   * @param {String} s
   */
  constructor(s) {
    super(s);
  }

  /**
   * @method
   * @param {String} s
   * @return {Boolean}
   */
  equals(s) {
    return s === this.state;
  }
}

/** @class */
export class NonTerminal extends Term {
  /**
   * @param {String} s
   */
  constructor(s) {
    super(s)
  }
}

export class Token {
  /**
   * 
   * @param {Term} term 
   * @param {string} lex 
   */
  constructor(term, lex = "") {
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
   * @return {Array.<String>}
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
export const rule_type = {
  reduce: 0,
  shift: 1
};

/** @class
 */
export class Rule {
  /**
   * @constructor
   * @param {Number} s
   * @param {String} t
   * @param {String} a
   * @param {Number} n
   */
  constructor(s, t, a, n) {
    this.state = s;
    this.token = t;
    /** @type {RuleType} */
    this.action = a === 'reduce' ? rule_type.reduce: rule_type.shift;
    this.num = n;
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

// module.exports.Term = Term;
// module.exports.Terminal = Terminal;
// module.exports.NonTerminal = NonTerminal;
// module.exports.Transition = Transition;
// module.exports.Rule = Rule;
// module.exports.IntermediateTransition = IntermediateTransition;
// module.exports.State = State;
// module.exports.rule_type = rule_type;
// module.exports.Token = Token;