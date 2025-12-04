/*
Language: MoonBit
Description: MoonBit is an intelligent developer platform for cloud and edge computing.
Website: https://www.moonbitlang.com/
Category: common
*/

function moonbit(hljs) {
  const regex = hljs.regex;
  const IDENT_RE = /[a-zA-Z_][a-zA-Z0-9_]*/;
  
  const KEYWORDS = [
    "_",
    "derive",
    "as",
    "lexmatch",
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
    "is",
    "in",
    "let",
    "loop",
    "match",
    "mut",
    "Self",
    "newtype",
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
    "Map",
    "Ref",
    "Option",
    "Result",
    "BigInt",
    "Show",
    "Default",
    "Eq",
    "Compare",
    "Hash",
    "Some",
    "None",
    "Error" // common error type
  ];

  const TYPES = BUILT_INS;

  const NUMBER_SUFFIX = '([Uu]([Ll]|L|N)|L|N)?';
  
  const NUMBER = {
    className: 'number',
    variants: [
        { begin: '\\b0b([01_]+)' + NUMBER_SUFFIX },
        { begin: '\\b0o([0-7_]+)' + NUMBER_SUFFIX },
        { begin: '\\b0x([A-Fa-f0-9_]+)' + NUMBER_SUFFIX },
        { begin: '\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)' + NUMBER_SUFFIX }
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
        // 普通字符串，支持转义和内插
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE, STRING_INTERPOLATION]
      },
      {
        // b'...'，支持转义
        begin: "b'",
        end: "'",
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        // 单引号字符 / 字符串，支持转义
        begin: "'",
        end: "'",
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };

  // Add self-reference to interpolation
  STRING_INTERPOLATION.contains = [
    NUMBER,
    STRING,
  ];

  const ATTRIBUTE = {
    className: "meta",
    begin: '@[a-zA-Z_][a-zA-Z0-9_]*',
  };

  const FUNCTION_INVOKE = {
    className: "function",
    begin: regex.concat(
      /\b/,
      /(?!let|for|while|if|else|match|is|pub|derive\b)/,
      IDENT_RE,
      regex.lookahead(/\s*\(/)
    )
  };

  return {
    name: 'MoonBit',
    aliases: ['mbt', 'moon'],
    keywords: {
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: BUILT_INS,
      type: TYPES
    },
    contains: [
      // `all` as a soft keyword inside pub(...)
      {
        begin: /\bpub\s*\(/,
        end: /\)/,
        contains: [
          {
            className: "keyword",
            begin: /\ball\b/
          }
        ]
      },
      // `longest` as a soft keyword only after `with`
      {
        className: "keyword",
        begin: /\bwith\s+longest\b/
      },
      COMMENT,
      MULTILINE_STRING,
      STRING,
      NUMBER,
      ATTRIBUTE,
      {
        // Function definition
        begin: [
          /fn/,
          /\s+/,
          IDENT_RE
        ],
        className: {
          1: "keyword",
          3: "title.function"
        }
      },
      {
        // Variable binding
        begin: [
          /let/,
          /\s+/,
          /(?:mut\s+)?/,
          IDENT_RE
        ],
        className: {
          1: "keyword",
          3: "keyword",
          4: "variable"
        }
      },
      {
        // For loop
        begin: [
          /for/,
          /\s+/,
          IDENT_RE,
          /\s+/,
          /in/
        ],
        className: {
          1: "keyword",
          3: "variable",
          5: "keyword"
        }
      },
      {
        // Type definition etc
        begin: [
          /(?:trait|enum|struct|type|typealias)/,
          /\s+/,
          IDENT_RE
        ],
        className: {
          1: "keyword",
          3: "title.class"
        }
      },
      {
        // Constructor call or Enum variant
        className: "type",
        begin: /\b[A-Z][a-zA-Z0-9_]*/,
        relevance: 0
      },
      {
        // Package access
        begin: regex.concat(IDENT_RE, '::'),
        keywords: {
            keyword: "Self",
            built_in: BUILT_INS,
            type: TYPES
        }
      },
      FUNCTION_INVOKE,
      {
        className: 'operator',
        begin: /=>|->|~|\.\.\.|\.\.|::|=|!|\?|!=|[<>]=?|&&|\|\||!|>>|<<|[+\-*/%]=?|[&|]/
      },
      {
        className: 'punctuation',
        begin: /\.|,|:/
      }
    ]
  };
}

module.exports = moonbit;
