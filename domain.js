/**
 * This file contain all and only the data types that are used
 * across the project. Don't define any top level function or
 * top level function calls in this module.
 * @module domain
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

/** @class */
export class Transition {
  /**
   * @param {String} f
   */
  constructor(f) {
    this.from = f;
    /**
     * @type {Array.<String>}
     */
    this.to = [];
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
