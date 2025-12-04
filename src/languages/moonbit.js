/*
Language: MoonBit
Description: MoonBit is an intelligent developer platform for cloud and edge computing.
Website: https://www.moonbitlang.com/
Category: common
*/

function moonbit(hljs) {
  const KEYWORDS = [
    "async",
    "break",
    "catch",
    "const",
    "continue",
    "derive",
    "else",
    "enum",
    "extern",
    "fn",
    "fnalias",
    "for",
    "guard",
    "if",
    "impl",
    "in",
    "let",
    "loop",
    "match",
    "mut",
    "newtype", // sometimes used in older versions or related languages, but sticking to grammar.js
    "priv",
    "pub",
    "raise",
    "return",
    "struct",
    "suberror",
    "test",
    "trait",
    "traitalias",
    "try",
    "type",
    "typealias",
    "while",
    "with",
    "noraise"
  ];

  const LITERALS = [
    "true",
    "false",
    "None",
    "Some",
    "Ok",
    "Err"
  ];

  const BUILT_INS = [
    "Unit",
    "Bool",
    "Int",
    "Int64",
    "UInt",
    "UInt64",
    "Double",
    "Float",
    "String",
    "Char",
    "Byte",
    "Bytes",
    "Array",
    "FixedArray",
    "List",
    "Map",
    "Ref",
    "Option",
    "Result",
    "BigInt",
    "Tuple",
    "Show",
    "Default",
    "Eq",
    "Compare",
    "Hash",
    "Debug"
  ];

  const NUMBER = {
    className: "number",
    variants: [
      { begin: '\\b0b[01_]+' },
      { begin: '\\b0o[0-7_]+' },
      { begin: '\\b0x[0-9a-fA-F_]+' },
      { begin: '\\b\\d[\\d_]*(\\.[\\d_]+)?([eE][+-]?[\\d_]+)?' }
    ]
  };

  const COMMENT = hljs.COMMENT(
    '//',
    '$',
    {
      contains: [
        {
          begin: '///',
          relevance: 0
        }
      ]
    }
  );

  const MULTILINE_STRING = {
    className: 'string',
    begin: '#\\|',
    end: '$',
    contains: [
      {
        begin: '\\\\.'
      }
    ]
  };

  const STRING_INTERPOLATION = {
    className: 'subst',
    begin: /\\\{/,
    end: /\}/,
    keywords: { keyword: KEYWORDS, literal: LITERALS, built_in: BUILT_INS },
    contains: [] // populated later
  };

  const STRING = {
    className: "string",
    variants: [
      {
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE, STRING_INTERPOLATION]
      },
      {
        begin: "b'",
        end: "'"
      },
      {
        begin: "'",
        end: "'"
      }
    ]
  };

  // Add self-reference to interpolation
  STRING_INTERPOLATION.contains = [
    NUMBER,
    STRING,
    // We can add more expressions here if needed
  ];

  const ATTRIBUTE = {
    className: "meta",
    begin: '@[a-zA-Z_][a-zA-Z0-9_.]*'
  };

  const FUNCTION_DEFINITION = {
    className: "function",
    beginKeywords: "fn",
    end: "\\s*(\\{|=)",
    excludeEnd: true,
    contains: [
      hljs.inherit(hljs.TITLE_MODE, { begin: /[a-zA-Z_][a-zA-Z0-9_]*/ }),
      {
        className: "params",
        begin: /\(/,
        end: /\)/,
        contains: [NUMBER, STRING, hljs.C_BLOCK_COMMENT_MODE]
      },
      {
        className: 'type',
        begin: '->',
        end: /\{/,
        excludeEnd: true
      }
    ]
  };

  return {
    name: 'MoonBit',
    aliases: ['mbt', 'moon'],
    keywords: {
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: BUILT_INS,
      type: BUILT_INS // Using built-ins as types often works well
    },
    contains: [
      COMMENT,
      MULTILINE_STRING,
      STRING,
      NUMBER,
      ATTRIBUTE,
      FUNCTION_DEFINITION,
      {
        className: "class",
        beginKeywords: "struct enum trait type",
        end: /\{/,
        excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, { begin: /[a-zA-Z_][a-zA-Z0-9_]*/ })
        ]
      },
      {
        // Match capitalized identifiers as types or constructors
        className: "type",
        begin: "\\b[A-Z][a-zA-Z0-9_]*",
        relevance: 0
      },
      {
        // Match function calls
        begin: /[a-z][a-zA-Z0-9_]*\s*(?=\()/,
        className: "function"
      },
      {
        className: 'operator',
        begin: /->|=>|::/
      }
    ]
  };
}

module.exports = moonbit;

